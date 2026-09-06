DELIMITER //

CREATE PROCEDURE AddColumnsIfMissing()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = 'notifications'
        AND column_name = 'recipient_email'
    ) THEN
        ALTER TABLE notifications ADD COLUMN recipient_email VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = 'student_profiles'
        AND column_name = 'resume_path'
    ) THEN
        ALTER TABLE student_profiles ADD COLUMN resume_path VARCHAR(500);
    END IF;
END //

DELIMITER ;

CALL AddColumnsIfMissing();
DROP PROCEDURE IF EXISTS AddColumnsIfMissing;
