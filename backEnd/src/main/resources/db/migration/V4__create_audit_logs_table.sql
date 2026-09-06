-- Migration to create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    icon VARCHAR(20) DEFAULT '📋',
    details VARCHAR(1000),
    timestamp DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
