#DEFECTS PROCEDURES

#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_register_defect (
    IN p_defect_description TEXT,
    IN p_severity ENUM('Low', 'Medium', 'High'),
    IN p_status ENUM('Returned', 'Approved', 'Rejected'),
    IN p_test_case_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering defect';
    END;

    -- Si no se pasa un valor para p_status, establecer 'Returned' como predeterminado
    IF p_status IS NULL THEN
        SET p_status = 'Returned';
    END IF;

    START TRANSACTION;
        INSERT INTO Defects (defect_description, severity, status, test_case_id)
        VALUES (p_defect_description, p_severity, p_status, p_test_case_id);
    COMMIT;
END //
DELIMITER ;

#
DELIMITER //
CREATE PROCEDURE procedure_get_all_defects()
BEGIN
    SELECT * FROM Defects;
END //
DELIMITER ;



#
DELIMITER //
CREATE PROCEDURE procedure_update_defect_status(
    IN p_defect_id INT,
    IN p_status ENUM('Returned', 'Approved', 'Rejected')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating defect status';
    END;

    START TRANSACTION;
        UPDATE Defects
        SET status = p_status
        WHERE defect_id = p_defect_id;
    COMMIT;
END //
DELIMITER ;


