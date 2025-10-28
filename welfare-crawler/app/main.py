# main.py

from collector import WelfareCollector
import time

def main():
    """크론잡 실행을 위한 메인 함수 (로컬에서는 데이터 수집 및 변환 확인)"""
    start_time = time.time()
    collector = None
    
    # 환경 변수 확인 (실제 쿠버네티스 환경에서는 이 값이 존재해야 함)
    # API_KEY를 가져오는 예시:
    from init import API_KEY
    print(f"INFO: 복지 서비스 데이터 수집 프로그램 시작: {time.ctime()}")
    print(f"INFO: 사용된 API KEY (첫 5자리): {API_KEY[:5]}...")

    try:
        collector = WelfareCollector()
        collector.run_collector()

    except Exception as e:
        print(f"FATAL ERROR: 프로그램 실행 중 치명적인 오류 발생: {e}")
    finally:
        # DB 연결 여부와 상관없이 close() 호출 (연결이 없으면 함수 내부에서 무시됨)
        if collector:
            collector.close()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"\nINFO: 프로그램 종료. 총 실행 시간: {elapsed_time:.2f}초")

if __name__ == "__main__":
    main()