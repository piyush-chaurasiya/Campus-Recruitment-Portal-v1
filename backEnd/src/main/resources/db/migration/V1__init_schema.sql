-- ==========================================================
-- Flyway Migration: V1__init_schema.sql
-- Campus Placement Portal Schema Initialization
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(30),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    branch VARCHAR(20),
    course VARCHAR(100),
    passing_year INT,
    skills VARCHAR(1000),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    tenth_percentage DOUBLE NOT NULL DEFAULT 0.0,
    tenth_math_percentage DOUBLE NOT NULL DEFAULT 0.0,
    twelfth_percentage DOUBLE NOT NULL DEFAULT 0.0,
    twelfth_math_percentage DOUBLE NOT NULL DEFAULT 0.0,
    cgpa DOUBLE NOT NULL DEFAULT 0.0,
    backlogs INT NOT NULL DEFAULT 0,
    academic_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    resume_name VARCHAR(255),
    resume_content_type VARCHAR(255),
    resume_path VARCHAR(500),
    resume_data LONGBLOB,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(255),
    location VARCHAR(255),
    description VARCHAR(2000),
    CONSTRAINT fk_recruiter_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    location VARCHAR(255),
    job_type VARCHAR(50),
    work_mode VARCHAR(50),
    status VARCHAR(50),
    paid BOOLEAN,
    stipend_or_salary DOUBLE,
    minimum_cgpa DOUBLE,
    maximum_backlogs INT,
    minimum_tenth_percentage DOUBLE,
    minimum_twelfth_percentage DOUBLE,
    eligible_branches VARCHAR(255),
    application_deadline DATE,
    joining_date DATE,
    created_at DATETIME,
    created_by VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_at DATETIME,
    updated_at DATETIME,
    remarks VARCHAR(1000),
    CONSTRAINT uk_job_student UNIQUE (job_id, student_id),
    CONSTRAINT fk_application_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academic_verification_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_profile_id BIGINT NOT NULL,
    tenth_percentage DOUBLE NOT NULL,
    tenth_math_percentage DOUBLE NOT NULL,
    twelfth_percentage DOUBLE NOT NULL,
    twelfth_math_percentage DOUBLE NOT NULL,
    cgpa DOUBLE NOT NULL,
    backlogs INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    rejection_reason VARCHAR(1000),
    submitted_at DATETIME NOT NULL,
    reviewed_at DATETIME,
    reviewed_by BIGINT,
    CONSTRAINT fk_verification_student FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    target_role VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
