# app/main.py
# -*- coding: utf-8 -*-
import os
from datetime import datetime
from typing import List, Dict, Optional
from .collector import (
    collect_union, save_json, save_csv, ensure_decoded_key,
    DEFAULT_LIFE_CODES, DEFAULT_THEME_CODES
)

def run(api_key: Optional[str] = None,
        life_codes: Optional[List[str]] = None,
        theme_codes: Optional[List[str]] = None,
        pages: int = 2,
        rows: int = 100,
        https: bool = False,
        debug: bool = False,
        out_dir: str = "./out") -> Dict:
    """
    파이프라인에서 호출하는 메인 함수.
    - 반환: {"count": int, "json": "...", "csv": "..."}
    """
    api_key = ensure_decoded_key(api_key or os.environ.get("WELFARE_API_KEY", ""))
    if not api_key:
        raise RuntimeError("WELFARE_API_KEY is required.")

    life_codes = life_codes or DEFAULT_LIFE_CODES
    theme_codes = theme_codes or DEFAULT_THEME_CODES

    records = collect_union(
        service_key=api_key,
        life_codes=life_codes,
        theme_codes=theme_codes,
        pages=pages,
        rows=rows,
        https=https,
        debug=debug
    )

    os.makedirs(out_dir, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(out_dir, f"welfare_50plus_latest_{ts}.json")
    csv_path  = os.path.join(out_dir, f"welfare_50plus_latest_{ts}.csv")

    save_json(json_path, records, theme_codes)
    save_csv(csv_path, records)
    return {"count": len(records), "json": json_path, "csv": csv_path}

# ---- 선택: CLI로도 실행 가능 ----
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Welfare 50+ collector (module mode)")
    ap.add_argument("--pages", type=int, default=2)
    ap.add_argument("--rows", type=int, default=100)
    ap.add_argument("--https", action="store_true")
    ap.add_argument("--themes", default="010,020,030,040,060,070,100,120,130")
    ap.add_argument("--life",   default="005,006")
    ap.add_argument("--out",    default="./out")
    ap.add_argument("--debug",  action="store_true")
    args = ap.parse_args()

    lc = [s.strip() for s in (args.life or "").split(",") if s.strip()]
    tc = [s.strip() for s in (args.themes or "").split(",") if s.strip()]

    res = run(
        life_codes=lc, theme_codes=tc,
        pages=args.pages, rows=args.rows,
        https=args.https, debug=args.debug,
        out_dir=args.out
    )
    print(res)
