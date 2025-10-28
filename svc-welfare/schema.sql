CREATE TABLE welfare (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    organization VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    local_upload_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    provider VARCHAR(255) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    INDEX idx_region (region),
    INDEX idx_title (title)
);

CREATE TABLE likes (
    id BINARY(16) PRIMARY KEY,
    welfare_id BINARY(16) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_welfare_user_like (welfare_id, user_id),
    FOREIGN KEY (welfare_id) REFERENCES welfare(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_welfare_id (welfare_id)
);

CREATE TABLE scraps (
    id BINARY(16) PRIMARY KEY,
    welfare_id BINARY(16) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_welfare_user_scrap (welfare_id, user_id),
    FOREIGN KEY (welfare_id) REFERENCES welfare(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_welfare_id (welfare_id)
);