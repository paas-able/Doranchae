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

MAX_RETRIES = 5      # 최대 재시도 횟수
RETRY_DELAY_SEC = 10  # 재시도 간 대기 시간 (초)
LIST_API_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist"
# DETAIL_API_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfaredetailed"

class WelfareCollector:
    def __init__(self):
        self.preview_data = []
        self.max_preview = 3
        self.db_connection = None
        self.is_db_connected = False
        self.success_count = 0
        self.first_data_logged = False

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
        
        # (수정) SQL 쿼리에서 id, start_date, end_date 제거, servId 추가
        insert_sql = """
        INSERT INTO welfare (
            servId, title, content, organization, region, local_upload_date, 
            provider, source_url
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE 
            title=VALUES(title), content=VALUES(content), organization=VALUES(organization),
            region=VALUES(region), local_upload_date=VALUES(local_upload_date),
            provider=VALUES(provider), source_url=VALUES(source_url)
        """
        
        cursor = self.db_connection.cursor()
        try:
            # (수정) bytes.fromhex(UUID) 변환 로직 제거
            cursor.execute(insert_sql, insert_tuple)
            self.db_connection.commit()
            if not self.first_data_logged:
                print("\n=============================================")
                print("INFO: 첫 번째 DB 삽입/업데이트 데이터 미리보기")
                print(f"  > servId (PK): {insert_tuple[0]}")
                print(f"  > Title: {insert_tuple[1]}")
                print(f"  > Region: {insert_tuple[4]}")
                print("=============================================\n")
                self.first_data_logged = True
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
    
    def _transform_list_item(self, serv_item):
        """(신규) 목록조회(servList)의 XML 항목(item)을 DB 스키마에 맞춰 변환"""
        if serv_item is None or not serv_item.findtext("servId"):
            return None, None
        
        serv_id = serv_item.findtext("servId")
        
        def format_date(date_str):
            if date_str and len(date_str) == 8:
                return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
            return None # 날짜 정보가 없으면 NULL

        data_to_insert = {
            "servId": serv_id,
            "title": serv_item.findtext("servNm", "제목 없음"),
            "content": serv_item.findtext("servDgst", "내용 없음"), 
            "organization": serv_item.findtext("bizChrDeptNm", "정보 없음"), 
            "region": f"{serv_item.findtext('ctpvNm', '')} {serv_item.findtext('sggNm', '')}".strip(), 
            "local_upload_date": format_date(serv_item.findtext("lastModYmd")), # 오늘 날짜 대신 NULL
            "provider": serv_item.findtext("srvPvsnNm", "정보 없음"), 
            "source_url": serv_item.findtext("servDtlLink", f"https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWATADS01001M.do?servId={serv_id}") # 상세 링크
            # start_date, end_date는 목록 API에 없으므로 제외
        }

        # 수정된 DB_COLUMNS 순서에 맞게 튜플 생성
        insert_tuple = tuple(data_to_insert.get(col, None) for col in DB_COLUMNS)
        
        return data_to_insert, insert_tuple

    def _process_list_api(self):
        """(수정) 목록조회 API를 통해 모든 데이터를 수집, 변환, 저장"""
        pageNo = 1
        
        # 트래픽 제한을 피하기 위해 numOfRows를 100으로 고정
        numOfRows = 100 
        total_pages = 1 
        total_collected = 0

        print(f"INFO: 서비스 목록 수집 및 저장 시작 ({'전체 목록' if self.is_db_connected else '로컬 확인용 1페이지'} 로드)...")

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
                
                if not serv_list_elements:
                    print(f"INFO: 페이지 {pageNo}에서 'servList' 항목을 찾을 수 없습니다.")
                    break

                page_success_count = 0
                for item in serv_list_elements:
                    transformed_dict, transformed_tuple = self._transform_list_item(item)
                    
                    if transformed_tuple:
                        if self.is_db_connected:
                            page_success_count += self._insert_to_db(transformed_tuple)
                        elif len(self.preview_data) < self.max_preview:
                            self.preview_data.append(transformed_dict)
                
                total_collected += len(serv_list_elements)
                self.success_count += page_success_count

                if self.is_db_connected:
                    print(f"INFO: 페이지 {pageNo}/{total_pages} 처리 완료. (현재 페이지 {page_success_count}건 저장/업데이트, 총 {self.success_count}건)")
                
                pageNo += 1
                
                if not self.is_db_connected and pageNo > 1:
                    print(f"\nINFO: 로컬 확인을 위해 {self.max_preview}건만 수집 후 중단합니다.")
                    break
                    
                if self.is_db_connected and pageNo <= total_pages:
                     time.sleep(1) # 1초 대기 (트래픽 제한 회피)
            else:
                print(f"ERROR: 목록 조회 API에서 데이터를 가져오는 데 실패하여 수집을 중단합니다. (페이지: {pageNo})")
                break

        print(f"INFO: 최종 {total_collected}개의 서비스 항목 처리 완료.")

    def run_collector(self):
        """데이터 수집 및 DB 저장/로컬 확인 실행 함수"""

        self.db_connection, self.is_db_connected = self._connect_db()

        self._process_list_api()
        
        if not self.is_db_connected:
            self._print_preview_data()
        else:
             print("\n=============================================")
             print(f"INFO: 전체 DB 작업 완료. 총 {self.success_count}건 DB에 저장/업데이트 성공.")
             print("=============================================")

    def _print_preview_data(self):
        """(수정) 변환된 샘플 데이터를 화면에 출력하여 확인 (새 DB_COLUMNS 기준)"""
        print("\n=============================================")
        print(f"INFO: 최종 DB 삽입 형식으로 변환된 데이터 ({len(self.preview_data)}건) 미리보기")
        print("=============================================")
        
        if not self.preview_data:
            print("변환된 데이터가 없습니다.")
            return

        for i, data in enumerate(self.preview_data):
            print(f"\n--- 샘플 데이터 {i+1} ---")
            # (수정) 수정된 DB_COLUMNS 기준으로 출력
            for col in DB_COLUMNS: 
                value = data.get(col, "N/A")
                if col == "content" and len(str(value)) > 100:
                    value = str(value)[:100] + "..."
                print(f"  {col:<20}: {value}")


    # def _get_serv_id_list(self):
    #     """목록조회 API를 통해 모든 servId를 수집 (DB 연결 시 전체 로딩)"""
    #     serv_ids = []
    #     pageNo = 1
        
    #     numOfRows = 10 if not self.is_db_connected else 100 
    #     total_pages = 1 

    #     print(f"INFO: 서비스 ID 목록 수집 시작 ({'전체 목록' if self.is_db_connected else '로컬 확인용 1페이지'} 로드)...")

    #     while pageNo <= total_pages: 
    #         params = {
    #             "serviceKey": API_KEY,
    #             "pageNo": pageNo,
    #             "numOfRows": numOfRows,
    #             "lifeArray": DEFAULT_LIFE,
    #             "intrsThemaArray": DEFAULT_THEMES,
    #         }
            
    #         root = self._api_request(LIST_API_URL, params)
            
    #         if root is not None:
    #             if pageNo == 1 and self.is_db_connected:
    #                 try:
    #                     totalCount = int(root.findtext("totalCount", 0))
    #                     total_pages = (totalCount + numOfRows - 1) // numOfRows
    #                     print(f"INFO: 총 {totalCount}건의 서비스. 총 {total_pages} 페이지.")
    #                 except ValueError:
    #                      print("WARN: totalCount 값을 읽을 수 없어 1페이지만 처리합니다.")
    #                      total_pages = 1

    #             serv_list_elements = root.findall('servList') 
    #             current_ids = [item.findtext("servId") for item in serv_list_elements if item.findtext("servId")]
    #             serv_ids.extend(current_ids)
                
    #             if self.is_db_connected:
    #                 print(f"INFO: 페이지 {pageNo}/{total_pages} 수집 완료. 현재까지 {len(serv_ids)}개.")
                
    #             pageNo += 1
                
    #             if not self.is_db_connected and pageNo > 1:
    #                 break
                    
    #             if self.is_db_connected and pageNo <= total_pages:
    #                  time.sleep(1) # 1초 대기 (트래픽 제한 회피)
    #         else:
    #             print("ERROR: 목록 조회 API에서 데이터를 가져오는 데 실패하여 수집을 중단합니다.")
    #             break

    #     print(f"INFO: 최종 {len(serv_ids)}개의 서비스 ID 수집 완료.")
    #     return list(set(serv_ids))

    # def _get_detailed_data(self, serv_id):
    #     """상세조회 API를 통해 서비스 상세 정보 획득"""
    #     params = {
    #         "serviceKey": API_KEY,
    #         "servId": serv_id,
    #     }
    #     return self._api_request(DETAIL_API_URL, params)

    # def _transform_data(self, detail_root):
    #     """XML ElementTree root 객체(상세조회 결과)를 받아 DB 스키마에 맞춰 변환"""
    #     if detail_root is None or not detail_root.findtext("servId"):
    #         return None, None
        
    #     serv_id = detail_root.findtext("servId")
        
    #     def format_date(date_str):
    #         if date_str and len(date_str) == 8:
    #             return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
    #         return None

    #     data_to_insert = {
    #         "id": uuid4().hex,
    #         "title": detail_root.findtext("servNm", "제목 없음"),
    #         "content": detail_root.findtext("servDgst", "내용 없음"), 
    #         "organization": detail_root.findtext("bizChrDeptNm", "정보 없음"), 
    #         "region": f"{detail_root.findtext('ctpvNm', '')} {detail_root.findtext('sggNm', '')}".strip(), 
    #         "local_upload_date": format_date(detail_root.findtext("lastModYmd", datetime.today().strftime('%Y%m%d'))),
    #         "start_date": format_date(detail_root.findtext("enfcBgngYmd", datetime.today().strftime('%Y%m%d'))),
    #         "end_date": format_date(detail_root.findtext("enfcEndYmd")),
    #         "provider": detail_root.findtext("srvPvsnNm", "정보 없음"), 
    #         "source_url": f"API_SOURCE_URL_FOR_DETAIL?servId={serv_id}" 
    #     }

    #     insert_tuple = tuple(data_to_insert.get(col, None) for col in DB_COLUMNS)
        
    #     return data_to_insert, insert_tuple

    