USE TestSync;
#APROBADO
# Procedure to register test_plans
DELIMITER //
CREATE PROCEDURE procedure_to_register_test_plans(
    IN p_project_id INT,
    IN p_user_id INT,
    IN p_plan_name VARCHAR(255),
    IN p_plan_type ENUM('Pruebas Funcionales', 'Pruebas de Integración', 
                        'Pruebas de Regresión', 'Pruebas de Aceptación', 
                        'Pruebas de Rendimiento', 'Pruebas de Seguridad', 
                        'Pruebas de Usabilidad', 'Pruebas de Compatibilidad'), -- Cambiado a ENUM
    IN p_description TEXT,       -- Nuevo campo
    IN p_start_date DATE,        -- Nuevo campo
    IN p_end_date DATE,          -- Nuevo campo
    IN p_document VARCHAR(255),
    IN p_status ENUM('Pending', 'In progress', 'Completed')
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering test plans';
    END;

    START TRANSACTION; 
    INSERT INTO Test_Plans (project_id, user_id, plan_name, plan_type, description, start_date, end_date, document, status)
    VALUES (p_project_id, p_user_id, p_plan_name, p_plan_type, p_description, p_start_date, p_end_date, p_document, p_status);
    
    COMMIT;
END //
DELIMITER ;


#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_update_test_plans(
    IN p_test_plan_id INT,
    IN p_plan_type ENUM('Pruebas Funcionales', 'Pruebas de Integración', 
                        'Pruebas de Regresión', 'Pruebas de Aceptación', 
                        'Pruebas de Rendimiento', 'Pruebas de Seguridad', 
                        'Pruebas de Usabilidad', 'Pruebas de Compatibilidad'), 
    IN p_description TEXT,
    IN p_document VARCHAR(255),
    IN p_status ENUM('Pending', 'In progress', 'Completed')
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating test plans.';
    END;

    START TRANSACTION; 

    -- Actualizar los campos solo si no son NULL
    UPDATE Test_Plans 
    SET 
        plan_type = COALESCE(p_plan_type, plan_type),
        description = COALESCE(p_description, description),
        document = COALESCE(p_document, document),
        status = COALESCE(p_status, status)
    WHERE test_plan_id = p_test_plan_id;
    
    COMMIT;
END //
DELIMITER ;


#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_delete_test_plan(IN p_test_plan_id INT)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting test plan';
    END;

    START TRANSACTION;

    DELETE FROM Test_Plans WHERE test_plan_id = p_test_plan_id;

    COMMIT;
END //
DELIMITER ;


#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_get_test_plans(IN p_project_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error fetching test plans';
    END;

    START TRANSACTION;
    SELECT 
        test_plan_id, 
        project_id, 
        user_id, 
        plan_name, 
        plan_type, 
        description, 
        start_date, 
        end_date, 
        document, 
        status
    FROM Test_Plans
    WHERE project_id = p_project_id;

    -- Confirmar la transacción (aunque no hay cambios en este caso, es bueno mantenerlo)
    COMMIT;
END //
DELIMITER ;



#APROBADO
DELIMITER //

CREATE PROCEDURE procedure_to_get_test_plans_by_user(IN p_user_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error fetching test plans by user';
    END;

    START TRANSACTION;

    SELECT 
        test_plan_id, 
        project_id, 
        user_id, 
        plan_name, 
        plan_type, 
        description, 
        start_date, 
        end_date, 
        document, 
        status
    FROM Test_Plans
    WHERE user_id = p_user_id;  -- Filtrando por el ID del usuario

    COMMIT;
END //

DELIMITER ;
