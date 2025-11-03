import os

# 환경 변수에서 민감 정보 로드 (API 키는 로컬 테스트용 더미 키)
API_KEY = os.getenv("WELFARE_API_KEY") 

# API 요청 파라미터 기본 설정 유지
DEFAULT_LIFE = "005,006"        
DEFAULT_THEMES = "010,020,030,040,060,070,100,120,130"

# --- DB 설정 ---
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "user"),
    "password": os.getenv("DB_PASSWORD", "password"),
    "database": os.getenv("DB_NAME", "welfare_db") 
}

# DB 테이블 스키마 정보
DB_COLUMNS = ('servId', 'title', 'content', 'organization', 'region', 'local_upload_date', 'provider', 'source_url')

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS welfare (
    servId VARCHAR(50) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    organization VARCHAR(255),
    region VARCHAR(100),
    local_upload_date DATE,
    provider VARCHAR(100),
    source_url VARCHAR(1024)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""