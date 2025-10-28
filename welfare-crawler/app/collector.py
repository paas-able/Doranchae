# collector.py (최종 버전)

import requests
import json
import time
from uuid import uuid4
from datetime import datetime
import xml.etree.ElementTree as ET
import mysql.connector
from mysql.connector import errorcode


# init.py에서 환경 변수 기반 설정 및 상수 가져오기
from init import (
    API_KEY,
    DEFAULT_LIFE, 
    DEFAULT_THEMES, 
    DB_COLUMNS,
    DB_CONFIG, 
    CREATE_TABLE_SQL
)

MAX_RETRIES = 3      # 최대 재시도 횟수
RETRY_DELAY_SEC = 10  # 재시도 간 대기 시간 (초)
LIST_API_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist"
DETAIL_API_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfaredetailed"

class WelfareCollector:
    def __init__(self):
        self.preview_data = []
        self.max_preview = 3
        self.db_connection = None
        self.is_db_connected = False

    def _connect_db(self):
        """MySQL DB 연결 및 테이블 존재 확인"""
        try:
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            cursor.execute(CREATE_TABLE_SQL)
            conn.commit()
            cursor.close()
            print("INFO: DB 연결 및 'welfare' 테이블 확인 완료.")
            return conn, True
        except mysql.connector.Error as err:
            print(f"WARN: DB 연결 실패 (로컬 환경이거나 설정 오류): {err}")
            return None, False
        except Exception as e:
            print(f"WARN: DB 연결 중 기타 오류 발생: {e}")
            return None, False

    def _insert_to_db(self, insert_tuple):
        """변환된 데이터를 DB에 삽입 (업데이트 시도 포함)"""
        if not self.is_db_connected:
            return 0
        
        insert_sql = """
        INSERT INTO welfare (
            id, title, content, organization, region, local_upload_date, 
            start_date, end_date, provider, source_url
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE 
            title=VALUES(title), content=VALUES(content), organization=VALUES(organization),
            region=VALUES(region), local_upload_date=VALUES(local_upload_date),
            start_date=VALUES(start_date), end_date=VALUES(end_date), 
            provider=VALUES(provider), source_url=VALUES(source_url)
        """
        
        cursor = self.db_connection.cursor()
        try:
            insert_data = (bytes.fromhex(insert_tuple[0]),) + insert_tuple[1:]
            
            cursor.execute(insert_sql, insert_data)
            self.db_connection.commit()
            return 1
        except mysql.connector.Error as err:
            print(f"ERROR: DB 삽입 오류 (ID: {insert_tuple[0][:8]}...): {err}")
            self.db_connection.rollback()
            return 0
        finally:
            cursor.close()

    def close(self):
        """DB 연결 해제"""
        if self.db_connection and self.is_db_connected:
            self.db_connection.close()
            print("INFO: DB 연결 해제.")

    def _api_request(self, url, params):
        """API 요청 공통 함수 (재시도 및 지연 로직 포함)"""
        if API_KEY == "TEST_API_KEY_REQUIRED":
            print("ERROR: API 키가 설정되지 않았습니다. 환경 변수 WELFARE_API_KEY를 설정하세요.")
            return None
        
        for attempt in range(MAX_RETRIES):
            try:
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status() 
                
                root = ET.fromstring(response.text)
                
                result_code = root.findtext('resultCode')
                result_message = root.findtext('resultMessage')
                
                if result_code in ["0", "00"]:
                    return root
                
                print(f"WARN: API 서버 오류 발생. 코드: {result_code}, 메시지: {result_message} (시도 {attempt + 1}/{MAX_RETRIES})")
                
            except requests.exceptions.RequestException as e:
                print(f"WARN: API 요청 오류 발생: {e} (시도 {attempt + 1}/{MAX_RETRIES})")
            except ET.ParseError:
                error_text = response.text if 'response' in locals() else "Unknown response"
                print(f"WARN: XML 파싱 오류. 서버 응답이 유효하지 않음. (시도 {attempt + 1}/{MAX_RETRIES})")
            
            if attempt < MAX_RETRIES - 1:
                print(f"INFO: {RETRY_DELAY_SEC}초 대기 후 재시도합니다.")
                time.sleep(RETRY_DELAY_SEC)
            
        print(f"ERROR: API 요청 최종 실패. URL: {url}")
        return None
    
    def _get_serv_id_list(self):
        """목록조회 API를 통해 모든 servId를 수집 (DB 연결 시 전체 로딩)"""
        serv_ids = []
        pageNo = 1
        
        numOfRows = 10 if not self.is_db_connected else 100 
        total_pages = 1 

        print(f"INFO: 서비스 ID 목록 수집 시작 ({'전체 목록' if self.is_db_connected else '로컬 확인용 1페이지'} 로드)...")

        while pageNo <= total_pages: 
            params = {
                "serviceKey": API_KEY,
                "pageNo": pageNo,
                "numOfRows": numOfRows,
                "lifeArray": DEFAULT_LIFE,
                "intrsThemaArray": DEFAULT_THEMES,
            }
            
            root = self._api_request(LIST_API_URL, params)
            
            if root is not None:
                if pageNo == 1 and self.is_db_connected:
                    try:
                        totalCount = int(root.findtext("totalCount", 0))
                        total_pages = (totalCount + numOfRows - 1) // numOfRows
                        print(f"INFO: 총 {totalCount}건의 서비스. 총 {total_pages} 페이지.")
                    except ValueError:
                         print("WARN: totalCount 값을 읽을 수 없어 1페이지만 처리합니다.")
                         total_pages = 1

                serv_list_elements = root.findall('servList') 
                current_ids = [item.findtext("servId") for item in serv_list_elements if item.findtext("servId")]
                serv_ids.extend(current_ids)
                
                if self.is_db_connected:
                    print(f"INFO: 페이지 {pageNo}/{total_pages} 수집 완료. 현재까지 {len(serv_ids)}개.")
                
                pageNo += 1
                
                if not self.is_db_connected and pageNo > 1:
                    break
                    
                if self.is_db_connected and pageNo <= total_pages:
                     time.sleep(1) # 1초 대기 (트래픽 제한 회피)
            else:
                print("ERROR: 목록 조회 API에서 데이터를 가져오는 데 실패하여 수집을 중단합니다.")
                break

        print(f"INFO: 최종 {len(serv_ids)}개의 서비스 ID 수집 완료.")
        return list(set(serv_ids))

    def _get_detailed_data(self, serv_id):
        """상세조회 API를 통해 서비스 상세 정보 획득"""
        params = {
            "serviceKey": API_KEY,
            "servId": serv_id,
        }
        return self._api_request(DETAIL_API_URL, params)

    def _transform_data(self, detail_root):
        """XML ElementTree root 객체(상세조회 결과)를 받아 DB 스키마에 맞춰 변환"""
        if detail_root is None or not detail_root.findtext("servId"):
            return None, None
        
        serv_id = detail_root.findtext("servId")
        
        def format_date(date_str):
            if date_str and len(date_str) == 8:
                return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
            return None

        data_to_insert = {
            "id": uuid4().hex,
            "title": detail_root.findtext("servNm", "제목 없음"),
            "content": detail_root.findtext("servDgst", "내용 없음"), 
            "organization": detail_root.findtext("bizChrDeptNm", "정보 없음"), 
            "region": f"{detail_root.findtext('ctpvNm', '')} {detail_root.findtext('sggNm', '')}".strip(), 
            "local_upload_date": format_date(detail_root.findtext("lastModYmd", datetime.today().strftime('%Y%m%d'))),
            "start_date": format_date(detail_root.findtext("enfcBgngYmd", datetime.today().strftime('%Y%m%d'))),
            "end_date": format_date(detail_root.findtext("enfcEndYmd")),
            "provider": detail_root.findtext("srvPvsnNm", "정보 없음"), 
            "source_url": f"API_SOURCE_URL_FOR_DETAIL?servId={serv_id}" 
        }

        insert_tuple = tuple(data_to_insert.get(col, None) for col in DB_COLUMNS)
        
        return data_to_insert, insert_tuple

    def run_collector(self):
        """데이터 수집 및 DB 저장/로컬 확인 실행 함수"""

        self.db_connection, self.is_db_connected = self._connect_db()

        serv_ids = self._get_serv_id_list()
        
        if not serv_ids:
            print("INFO: 수집할 서비스 ID가 없습니다.")
            return

        total_count = len(serv_ids)
        preview_count = 0
        success_count = 0 # <-- **수정:** success_count 초기화
        
        limit_count = self.max_preview if not self.is_db_connected else total_count
        
        print(f"\nINFO: 상세 정보 수집 및 변환 시작 (총 {total_count}건 중 {'모두 DB 저장 시도' if self.is_db_connected else f'최대 {limit_count}건 로컬 확인'})...")

        for i, serv_id in enumerate(serv_ids):
            detail_root = self._get_detailed_data(serv_id)
            
            if detail_root:
                transformed_dict, transformed_tuple = self._transform_data(detail_root)
                
                if self.is_db_connected:
                    success_count += self._insert_to_db(transformed_tuple)
                    if (i + 1) % 100 == 0 or (i + 1) == total_count:
                        print(f"INFO: 진행률 {i+1}/{total_count} 완료. DB 저장 성공 건수: {success_count}")
                
                elif len(self.preview_data) < self.max_preview:
                    self.preview_data.append(transformed_dict)
                
            if not self.is_db_connected and len(self.preview_data) >= self.max_preview:
                print(f"\nINFO: 로컬 확인을 위해 {self.max_preview}건만 수집 후 중단합니다.")
                break

        if not self.is_db_connected:
            self._print_preview_data()
        else:
             print("\n=============================================")
             print(f"INFO: 전체 DB 작업 완료. 총 {total_count}건 중 {success_count}건 DB에 저장/업데이트 성공.")
             print("=============================================")

    def _print_preview_data(self):
        """변환된 샘플 데이터를 화면에 출력하여 확인"""
        print("\n=============================================")
        print(f"INFO: 최종 DB 삽입 형식으로 변환된 데이터 ({len(self.preview_data)}건) 미리보기")
        print("=============================================")
        
        if not self.preview_data:
            print("변환된 데이터가 없습니다.")
            return

        for i, data in enumerate(self.preview_data):
            print(f"\n--- 샘플 데이터 {i+1} ---")
            for col in DB_COLUMNS:
                value = data.get(col, "N/A")
                if col == "content" and len(str(value)) > 100:
                    value = str(value)[:100] + "..."
                print(f"  {col:<20}: {value}")