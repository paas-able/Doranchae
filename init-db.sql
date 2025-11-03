-- init-db.sql (수정본 - 사용자 생성과 권한 부여를 모두 담당)

-- 1. (중요!) 'doranchae_user'@'%' 사용자를 먼저 생성 (비밀번호는 'password')
-- 이미 존재하면 무시 (IF NOT EXISTS)
CREATE USER IF NOT EXISTS 'doranchae_user'@'%' IDENTIFIED BY 'password';

-- 2. 각 서비스가 사용할 데이터베이스(스키마) 생성 (이미 존재하면 무시)
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS community_db;
CREATE DATABASE IF NOT EXISTS penpal_db;
CREATE DATABASE IF NOT EXISTS welfare_db;
CREATE DATABASE IF NOT EXISTS chat_db;

-- 3. 생성된 사용자에게 각 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON user_db.* TO 'doranchae_user'@'%';
GRANT ALL PRIVILEGES ON community_db.* TO 'doranchae_user'@'%';
GRANT ALL PRIVILEGES ON penpal_db.* TO 'doranchae_user'@'%';
GRANT ALL PRIVILEGES ON welfare_db.* TO 'doranchae_user'@'%';
GRANT ALL PRIVILEGES ON chat_db.* TO 'doranchae_user'@'%';

-- 4. 변경사항 적용
FLUSH PRIVILEGES;