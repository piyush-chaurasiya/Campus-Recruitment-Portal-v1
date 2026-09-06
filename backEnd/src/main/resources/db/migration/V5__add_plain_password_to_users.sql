DELIMITER //

CREATE PROCEDURE AddPlainPasswordIfMissing()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = 'users'
        AND column_name = 'plain_password'
    ) THEN
        ALTER TABLE users ADD COLUMN plain_password VARCHAR(255);
    END IF;
END //

DELIMITER ;

CALL AddPlainPasswordIfMissing();
DROP PROCEDURE IF EXISTS AddPlainPasswordIfMissing;

UPDATE users SET plain_password = 'Student@123' WHERE email = 'student@campus.com' AND (plain_password IS NULL OR plain_password = '');
UPDATE users SET plain_password = 'Recruiter@123' WHERE email = 'recruiter@campus.com' AND (plain_password IS NULL OR plain_password = '');
UPDATE users SET plain_password = 'Officer@123' WHERE email = 'officer@campus.com' AND (plain_password IS NULL OR plain_password = '');
UPDATE users SET plain_password = 'Admin@123' WHERE email = 'admin@campus.com' AND (plain_password IS NULL OR plain_password = '');
