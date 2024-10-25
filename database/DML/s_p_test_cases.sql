USE TestSync;

#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_register_test_case(
    IN p_test_plan_id INT,
    IN p_project_role_id INT,
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_status ENUM('Passed', 'Failed', 'Pending'),
    IN p_priority ENUM('Low', 'Medium', 'High')
)
BEGIN
    INSERT INTO Test_Cases (test_plan_id, project_role_id, name, description, status, priority)
    VALUES (p_test_plan_id, p_project_role_id, p_name, p_description, p_status, p_priority);
END //
DELIMITER ;

#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_update_test_case_status(
    IN p_test_case_id INT,
    IN p_status ENUM('Passed', 'Failed', 'Pending')
)
BEGIN
    UPDATE Test_Cases
    SET status = p_status
    WHERE test_case_id = p_test_case_id;
END //
DELIMITER ;









DELIMITER //
CREATE PROCEDURE procedure_to_register_test_case(
    IN p_test_plan_id INT,
    IN p_tests TEXT,
    IN p_tester_id INT,
    IN p_description TEXT,
    IN p_status ENUM('Passed', 'Failed', 'Pending'),
    IN p_evidence TEXT,
    IN p_advance TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering test case';
    END;

    START TRANSACTION; 
        INSERT INTO Test_Cases (test_plan_id, tests, tester_id, description, status, evidence, advance) 
        VALUES (p_test_plan_id, p_tests, p_tester_id, p_description, p_status, p_evidence, p_advance);
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_test_case(
    IN p_test_case_id INT,
    IN p_tests TEXT,
    IN p_description TEXT,
    IN p_status ENUM('Passed', 'Failed', 'Pending'),
    IN p_evidence TEXT,
    IN p_advance TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating test case';
    END;

    START TRANSACTION; 
        UPDATE Test_Cases 
        SET 
            tests = COALESCE(p_tests, tests),
            description = COALESCE(p_description, description),
            status = COALESCE(p_status, status),
            evidence = COALESCE(p_evidence, evidence),
            advance = COALESCE(p_advance, advance)
        WHERE test_case_id = p_test_case_id;
    COMMIT;
END //
DELIMITER ;
