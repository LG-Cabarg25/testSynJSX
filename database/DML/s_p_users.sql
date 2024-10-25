USE TestSync;

# Procedure to register user
DELIMITER // 
CREATE PROCEDURE procedure_to_register_user(
	IN p_fullname VARCHAR(75),
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering user.';
	END;
    START TRANSACTION; 
		INSERT INTO Users (name, fullname, username, email, password, createdAt)
		VALUES (p_fullname, p_username, p_phone, p_email, p_password, NOW());
	COMMIT;
END //
DELIMITER ;

# Procedure to update user
DELIMITER //
CREATE PROCEDURE procedure_to_update_user(
    IN p_id INT,
    IN p_fullname VARCHAR(75),
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM Users
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User exists but is logically deleted.';
    ELSE
        UPDATE Users
        SET name = p_fullname,
            username = username,
            email = p_email,
            password = p_password
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

# Procedure to login user
DELIMITER //
CREATE PROCEDURE procedure_login_user(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error logging in user.';
    END;
    SELECT id 
    FROM Users
    WHERE username = p_username AND password = p_password_hash; 
END //
DELIMITER ;

# Procedure to Delete logically user
DELIMITER //
CREATE PROCEDURE procedure_to_delete_user(
    IN p_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing user logical deletion.';
    END;
		START TRANSACTION;
			DELETE FROM Users
			WHERE id = p_id;
		COMMIT;
END //
DELIMITER ;