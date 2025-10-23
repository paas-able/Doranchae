# app/collector.py
# -*- coding: utf-8 -*-
import os, time, json
import requests
import pandas as pd
import xml.etree.ElementTree as ET
from urllib.parse import unquote
from datetime import datetime
from typing import Dict, List, Tuple, Any
# DB 연결용 라이브러리
import mysql.connector
from mysql.connector import Error

# 기본 필터
DEFAULT_LIFE_CODES = ["005", "006"]  # 중장년, 노년
DEFAULT_THEME_CODES = ["010","020","030","040","060","070","100","120","130"]

def ensure_decoded_key(key: str) -> str:
    return unquote(key or "")

def make_endpoints(use_https: bool) -> Tuple[str, str]:
    scheme = "https" if use_https else "http"
    base = f"{scheme}://apis.data.go.kr/B554287/NationalWelfareInformationsV001"
    return f"{base}/NationalWelfarelistV001", f"{base}/NationalWelfaredetailedV001"

# ---------------- XML 파서 ----------------
def parse_list_xml(text: str) -> Dict:
    root = ET.fromstring(text)
    def g(tag):
        e = root.find(f".//{tag}")
        return e.text.strip() if e is not None and e.text else None
    result = {"resultCode": g("resultCode"), "resultMessage": g("resultMessage"),
              "totalCount": 0, "items": []}
    tc = g("totalCount")
    if tc and tc.isdigit():
        result["totalCount"] = int(tc)
    for serv in root.findall(".//servList"):
        rec = {}
        for ch in list(serv):
            tag = ch.tag.split("}")[-1]
            rec[tag] = (ch.text or "").strip()
        result["items"].append(rec)
    return result

def parse_detail_xml(text: str) -> Dict:
    root = ET.fromstring(text)
    def g(tag):
        e = root.find(f".//{tag}")
        return e.text.strip() if e is not None and e.text else ""
    detail = {}
    for tag in ["servId","servNm","jurMnofNm","tgtrDtlCn","slctCritCn","alwServCn",
                "crtrYr","rprsCtadr","wlfareInfoOutlCn","sprtCycNm","srvPvsnNm",
                "lifeArray","trgterIndvdlArray","intrsThemaArray"]:
        detail[tag] = g(tag)
    # 문의처
    contacts = []
    for node in root.findall(".//inqplCtadrList"):
        contacts.append({
            "contact_number": (node.findtext("servSeDetailLink") or "").strip(),
            "contact_name":   (node.findtext("servSeDetailNm") or "").strip(),
        })
    detail["contact_info"] = contacts
    # 관련 홈페이지
    sites = []
    for node in root.findall(".//inqplHmpgReldList"):
        sites.append({
            "url":  (node.findtext("servSeDetailLink") or "").strip(),
            "name": (node.findtext("servSeDetailNm") or "").strip(),
        })
    detail["related_websites"] = sites
    # 서식/자료
    forms = []
    for node in root.findall(".//basfrmList"):
        forms.append({
            "download_url": (node.findtext("servSeDetailLink") or "").strip(),
            "document_name":(node.findtext("servSeDetailNm") or "").strip(),
        })
    detail["forms_documents"] = forms
    # 근거법령
    laws = []
    for node in root.findall(".//baslawList"):
        nm = (node.findtext("servSeDetailNm") or "").strip()
        if nm:
            laws.append(nm)
    detail["legal_basis"] = laws
    detail["resultCode"] = (root.findtext(".//resultCode") or "").strip()
    detail["resultMessage"] = (root.findtext(".//resultMessage") or "").strip()
    return detail

# ---------------- 안전 병합 ----------------
def _is_meaningful(v: Any) -> bool:
    if v is None: return False
    if isinstance(v, str): return v.strip() != ""
    if isinstance(v, (list, dict, tuple, set)): return len(v) > 0
    return True

def smart_merge(base: Dict, overlay: Dict) -> Dict:
    out = dict(base)
    for k, v in overlay.items():
        if _is_meaningful(v):
            out[k] = v
    return out

# ---------------- API 호출 ----------------
def fetch_list(session: requests.Session, list_ep: str, service_key: str,
               life_code: str, page: int, rows: int, order_by: str,
               theme_codes: List[str], timeout: int = 15, debug: bool = False) -> Dict:
    params = {
        "serviceKey": service_key,
        "callTp": "L",
        "srchKeyCode": "003",
        "pageNo": page,
        "numOfRows": rows,
        "lifeArray": life_code,
        "orderBy": order_by
    }
    if theme_codes:
        params["intrsThemaArray"] = ",".join(theme_codes)
    r = session.get(list_ep, params=params, timeout=timeout)
    if debug and page == 1:
        print("[debug] list url:", r.url)
    r.raise_for_status()
    return parse_list_xml(r.text)

def fetch_detail(session: requests.Session, detail_ep: str, service_key: str, serv_id: str,
                 timeout: int = 20) -> Dict:
    params = {"serviceKey": service_key, "callTp": "D", "servId": serv_id}
    r = session.get(detail_ep, params=params, timeout=timeout)
    r.raise_for_status()
    return parse_detail_xml(r.text)

# ---------------- 수집 파이프라인(함수) ----------------
def collect_union(service_key: str,
                  life_codes: List[str] = None,
                  theme_codes: List[str] = None,
                  pages: int = 2, rows: int = 100,
                  order_by: str = "date",
                  delay: float = 0.25,
                  https: bool = False,
                  debug: bool = False) -> List[Dict]:
    life_codes = life_codes or DEFAULT_LIFE_CODES
    theme_codes = theme_codes or DEFAULT_THEME_CODES
    list_ep, detail_ep = make_endpoints(https)
    session = requests.Session()

    # 연결 테스트(간단 검증)
    test_params = {"serviceKey": service_key, "callTp": "L", "srchKeyCode": "003",
                   "pageNo": 1, "numOfRows": 5, "lifeArray": "006", "orderBy": "date"}
    if theme_codes:
        test_params["intrsThemaArray"] = ",".join(theme_codes)
    r = requests.get(list_ep, params=test_params, timeout=15)
    r.raise_for_status()
    try:
        parsed = ET.fromstring(r.text)
        rc = (parsed.findtext(".//resultCode") or "").strip()
        if rc not in ("", "0"):
            raise RuntimeError(f"Connectivity failed: resultCode={rc}")
    except ET.ParseError:
        raise RuntimeError("Connectivity failed: invalid XML")

    # 목록 합집합
    seen, pooled = set(), []
    for life in life_codes:
        for page in range(1, pages + 1):
            res = fetch_list(session, list_ep, service_key, life, page, rows, order_by, theme_codes, debug=debug)
            items = res.get("items") or []
            if not items:
                break
            for it in items:
                sid = it.get("servId")
                if sid and sid not in seen:
                    seen.add(sid)
                    pooled.append(it)
            if len(items) < rows:
                break
            time.sleep(delay)

    if not pooled:
        return []

    # 상세 병합
    detailed = []
    for it in pooled:
        sid = it.get("servId")
        try:
            det = fetch_detail(session, detail_ep, service_key, sid)
            merged = smart_merge(it, det)
        except Exception:
            merged = dict(it)  # 상세 실패 시 목록만 유지
        detailed.append(merged)
        time.sleep(delay)

    # 최신 정렬
    def sort_key(rec: Dict):
        reg = rec.get("svcfrstRegTs") or ""
        try:
            return datetime.strptime(reg, "%Y%m%d")
        except:
            return datetime.min
    detailed.sort(key=sort_key, reverse=True)
    return detailed

# ---------------- DB 저장 유틸 ----------------
def save_to_db(db_host, db_user, db_password, db_name, records: List[Dict]):
    """
    수집된 데이터를 MySQL welfare_db에 저장 (UPSERT 방식).
    """
    if not records:
        print("저장할 데이터가 없습니다.")
        return 0, 0 # 삽입된 수, 업데이트된 수 반환

    connection = None
    cursor = None
    inserted_count = 0
    updated_count = 0

    try:
        print(f"Connecting to MySQL database: {db_host}/{db_name}")
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        cursor = connection.cursor()
        print("MySQL connection successful.")

        # 저장할 컬럼 정의
        columns = [
            "servId", "servNm", "jurMnofNm", "tgtrDtlCn", "slctCritCn", "alwServCn",
            "crtrYr", "rprsCtadr", "wlfareInfoOutlCn", "sprtCycNm", "srvPvsnNm",
            "lifeArray", "trgterIndvdlArray", "intrsThemaArray",
            "contact_numbers", "contact_names", "website_urls", "website_names",
            "form_urls", "form_names", "legal_basis_list", "svcfrstRegTs"
        ]
        # SQL 쿼리 생성 (UPSERT: INSERT 시도 후 키 중복 시 UPDATE)
        cols_str = ", ".join(columns)
        placeholders = ", ".join([f"%({col})s" for col in columns])
        update_cols = ", ".join([f"{col}=VALUES({col})" for col in columns if col != "servId"]) # servId는 업데이트 제외

        sql = f"""
            INSERT INTO welfare_services ({cols_str}, lastUpdateTime)
            VALUES ({placeholders}, NOW())
            ON DUPLICATE KEY UPDATE {update_cols}, lastUpdateTime=NOW();
        """

        processed_records = []
        for record in records:
            flat_record = {}
            flat_record["servId"] = record.get("servId", "")
            flat_record["servNm"] = record.get("servNm", "")
            flat_record["jurMnofNm"] = record.get("jurMnofNm", "")
            flat_record["tgtrDtlCn"] = record.get("tgtrDtlCn", "")
            flat_record["slctCritCn"] = record.get("slctCritCn", "")
            flat_record["alwServCn"] = record.get("alwServCn", "")
            flat_record["crtrYr"] = record.get("crtrYr", "")
            flat_record["rprsCtadr"] = record.get("rprsCtadr", "")
            flat_record["wlfareInfoOutlCn"] = record.get("wlfareInfoOutlCn", "")
            flat_record["sprtCycNm"] = record.get("sprtCycNm", "")
            flat_record["srvPvsnNm"] = record.get("srvPvsnNm", "")
            flat_record["lifeArray"] = record.get("lifeArray", "")
            flat_record["trgterIndvdlArray"] = record.get("trgterIndvdlArray", "")
            flat_record["intrsThemaArray"] = record.get("intrsThemaArray", "")
            flat_record["svcfrstRegTs"] = record.get("svcfrstRegTs", "")

            contacts = record.get("contact_info") or []
            flat_record["contact_numbers"] = "; ".join([c.get("contact_number","") for c in contacts if c.get("contact_number")])
            flat_record["contact_names"]   = "; ".join([c.get("contact_name","") for c in contacts if c.get("contact_name")])
            sites = record.get("related_websites") or []
            flat_record["website_urls"] = "; ".join([s.get("url","") for s in sites if s.get("url")])
            flat_record["website_names"] = "; ".join([s.get("name","") for s in sites if s.get("name")])
            forms = record.get("forms_documents") or []
            flat_record["form_urls"]  = "; ".join([f.get("download_url","") for f in forms if f.get("download_url")])
            flat_record["form_names"] = "; ".join([f.get("document_name","") for f in forms if f.get("document_name")])
            laws = record.get("legal_basis") or []
            flat_record["legal_basis_list"] = "; ".join(laws)

            # None 값을 빈 문자열로 대체
            for key, value in flat_record.items():
                if value is None:
                    flat_record[key] = ""

            processed_records.append(flat_record)

        # 한번에 업데이트
        cursor.executemany(sql, processed_records)

        connection.commit()

        # 실제 영향 받은 행 수 확인 (정확하지 않을 수 있음, cursor.rowcount는 마지막 실행 결과만 반영)
        # 좀 더 정확하게 하려면 각 execute 후 rowcount를 누적해야 함
        affected_rows = cursor.rowcount * len(processed_records) # 대략적인 추정
        # 실제로는 INSERT(1)와 UPDATE(2)가 섞여 rowcount 만으로는 구분 어려움
        print(f"DB 저장 완료: 총 {len(records)}건 데이터 처리 시도.")
        # inserted_count, updated_count 계산 로직은 단순화 (필요 시 추가 구현)

    except Error as e:
        print(f"DB 저장 중 오류 발생: {e}")
        if connection:
            connection.rollback()

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed.")

    # 실제 삽입/업데이트된 카운트를 반환하는 것은 복잡하므로 단순화
    return len(records), 0 # 처리 시도 건수만 반환 (정확한 카운트 필요 시 로직 추가)




# 단순 json 저장 코드는 일단 주석처리 -> DB 저장으로 대체
'''
# ---------------- 저장 유틸 -------------------
def save_json(path: str, records: List[Dict], themes: List[str]) -> str:
    export = {
        "metadata": {
            "collection_date": datetime.now().isoformat(),
            "total_services": len(records),
            "description": "중장년(005)+노년(006) 관심주제 최신순(빈값 안전 병합)",
            "themes": themes,
        },
        "services": records,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(export, f, ensure_ascii=False, indent=2)
    return path

def save_csv(path: str, records: List[Dict]) -> str:
    if not records:
        return path
    flattened = []
    for svc in records:
        row = dict(svc)
        contacts = svc.get("contact_info") or []
        row["contact_numbers"] = "; ".join([c.get("contact_number","") for c in contacts if c.get("contact_number")])
        row["contact_names"]   = "; ".join([c.get("contact_name","") for c in contacts if c.get("contact_name")])
        sites = svc.get("related_websites") or []
        row["website_urls"] = "; ".join([s.get("url","") for s in sites if s.get("url")])
        row["website_names"] = "; ".join([s.get("name","") for s in sites if s.get("name")])
        forms = svc.get("forms_documents") or []
        row["form_urls"]  = "; ".join([f.get("download_url","") for f in forms if f.get("download_url")])
        row["form_names"] = "; ".join([f.get("document_name","") for f in forms if f.get("document_name")])
        laws = svc.get("legal_basis") or []
        row["legal_basis_list"] = "; ".join(laws)
        for k in ["contact_info","related_websites","forms_documents","legal_basis"]:
            row.pop(k, None)
        flattened.append(row)
    df = pd.DataFrame(flattened)
    df.to_csv(path, index=False, encoding="utf-8-sig")
    return path
'''