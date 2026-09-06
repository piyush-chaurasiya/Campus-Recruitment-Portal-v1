-- Migration to create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 45,
    mode VARCHAR(20) NOT NULL DEFAULT 'ONLINE',
    meeting_link VARCHAR(500),
    location VARCHAR(255),
    round_name VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    notes VARCHAR(1000),
    created_at DATETIME,
    CONSTRAINT fk_interview_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
