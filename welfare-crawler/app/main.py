# app/main.py
# -*- coding: utf-8 -*-
import os
import sys
from datetime import datetime
from typing import List, Dict, Optional
# --- save_json, save_csv 대신 save_to_db import ---
from .collector import (
    collect_union, ensure_decoded_key, save_to_db,
    DEFAULT_LIFE_CODES, DEFAULT_THEME_CODES

def run(api_key: Optional[str] = None,
        life_codes: Optional[List[str]] = None,
        theme_codes: Optional[List[str]] = None,
        pages: int = 2,
        rows: int = 100,
        https: bool = False,
        debug: bool = False) -> Dict: 
    """
    파이프라인에서 호출하는 메인 함수.
    - 반환: {"status": str, "collected": int, "inserted": int, "updated": int}
    """
    print("Starting welfare data collection...")
    api_key = ensure_decoded_key(os.environ.get("WELFARE_API_KEY", ""))
    if not api_key:
        raise RuntimeError("WELFARE_API_KEY is required.")
    print("API Key loaded.")

    # --- DB 연결 정보 로드 (환경 변수 사용) ---
    db_host = os.environ.get("DB_HOST")
    db_user = os.environ.get("DB_USER")
    db_password = os.environ.get("DB_PASSWORD")
    db_name = "welfare_db" # DB 이름 고정

    if not all([db_host, db_user, db_password]):
        raise RuntimeError("DB_HOST, DB_USER, DB_PASSWORD environment variables are required.")
    print(f"Database connection info loaded: Host={db_host}, User={db_user}, DB={db_name}")

    life_codes = life_codes or DEFAULT_LIFE_CODES
    theme_codes = theme_codes or DEFAULT_THEME_CODES

    print("Collecting data from API...")
    records = collect_union(
        service_key=api_key,
        life_codes=life_codes,
        theme_codes=theme_codes,
        pages=pages,
        rows=rows,
        https=https,
        debug=debug
    )
    print(f"Data collection finished. Found {len(records)} records.")

    # --- 파일 저장 대신 DB 저장 함수 호출 ---
    if records:
        print("Saving data to database...")
        # save_to_db 함수의 반환 값을 받도록 수정 (필요 시)
        processed_count, _ = save_to_db(db_host, db_user, db_password, db_name, records)
        print(f"Finished saving data. Attempted to process {processed_count} records.")
        # 상세 카운트 필요 시 save_to_db 반환 값 수정 및 활용
        return {"status": "completed", "collected": len(records), "processed": processed_count}
    else:
        print("No records to save.")
        return {"status": "completed", "collected": 0, "processed": 0}
    
    
    # 기존 json/csv 저장코드는 주석 처리
    """
    os.makedirs(out_dir, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(out_dir, f"welfare_50plus_latest_{ts}.json")
    csv_path  = os.path.join(out_dir, f"welfare_50plus_latest_{ts}.csv")

    save_json(json_path, records, theme_codes)
    save_csv(csv_path, records)
    return {"count": len(records), "json": json_path, "csv": csv_path}
   """
 
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Welfare 50+ collector (DB mode)")
    ap.add_argument("--pages", type=int, default=2)
    ap.add_argument("--rows", type=int, default=100)
    ap.add_argument("--https", action="store_true")
    ap.add_argument("--themes", default="010,020,030,040,060,070,100,120,130")
    ap.add_argument("--life",   default="005,006")
    ap.add_argument("--debug",  action="store_true")
    args = ap.parse_args()

    # 로컬 테스트 시 환경 변수 기본값 설정 -> 필요시 진행. 일단 주석처리
    '''
    os.environ.setdefault("DB_HOST", "127.0.0.1")
    os.environ.setdefault("DB_USER", "doranchae_user")
    os.environ.setdefault("DB_PASSWORD", "your_local_db_password")
    os.environ.setdefault("WELFARE_API_KEY", "your_api_key_for_local_test")
    '''

    lc = [s.strip() for s in (args.life or "").split(",") if s.strip()]
    tc = [s.strip() for s in (args.themes or "").split(",") if s.strip()]

    try:
        res = run(
            life_codes=lc, theme_codes=tc,
            pages=args.pages, rows=args.rows,
            https=args.https, debug=args.debug
        )
        print("Run finished successfully:", res)
        # 정상 종료 시 exit code 0 반환 (CronJob 성공)
        sys.exit(0)
    except Exception as e:
        print(f"An error occurred during run: {e}")
        # 오류 발생 시 exit code 1 반환 (CronJob 실패)
        sys.exit(1)