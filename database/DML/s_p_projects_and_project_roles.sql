USE TestSync;

# Procedure to register Projects
DELIMITER //
CREATE PROCEDURE procedure_to_register_projects(
    IN p_project_name VARCHAR(255),    
    IN p_description TEXT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_status ENUM('In Progress', 'Completed', 'Pending'),
    IN p_pm_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering project.';
    END;
    START TRANSACTION; 
    INSERT INTO Projects (project_name, description, start_date, end_date, status, pm_id, created_at)
    VALUES (p_project_name, p_description, p_start_date, p_end_date, p_status, p_pm_id, NOW());
    COMMIT;
END //
DELIMITER ;


# Procedure to register Projects
	DELIMITER //
	CREATE PROCEDURE procedure_to_updated_project(
		IN p_project_id INT,
		IN p_project_name VARCHAR(255),    
		IN p_description TEXT,
		IN p_start_date DATE,
		IN p_end_date DATE,
		IN p_status ENUM('In Progress', 'Completed', 'Pending')
	)
	BEGIN 
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			ROLLBACK;
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating project.';
		END;
		START TRANSACTION; 
		UPDATE Projects 
			SET project_name = p_project_name, 
				description = p_description, 
				start_date = p_start_date, 
				end_date = p_end_date, 
				status = p_status
			WHERE project_id = p_project_id;  -- Cambiado 'id' por 'project_id'
		COMMIT;
	END //
	DELIMITER ;

# Procedure to UPDATE ROLES
DELIMITER //
CREATE PROCEDURE procedure_to_updated_project_roles(
	IN p_project_role_id INT,
    IN p_role ENUM('PM', 'Tester','Developer','QA')
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating project and roles.';
    END;
    START TRANSACTION; 
    UPDATE Project_Roles
		SET role = p_role
            WHERE project_role_id = p_project_role_id;
    COMMIT;
END //
DELIMITER ;


# Procedure to PROJECTROLES
DELIMITER //
CREATE PROCEDURE procedure_to_register_project_roles(
	IN p_project_id INT,
    IN p_team_roles JSON
)
BEGIN 
    DECLARE v_user_id INT;
    DECLARE v_role ENUM('PM','Tester','Developer','QA');
    DECLARE i INT DEFAULT 0;
    DECLARE v_len INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering project roles.';
    END;
    START TRANSACTION; 
    SET v_len = JSON_LENGTH(p_team_roles);
    WHILE i < v_len DO
        SET v_user_id = JSON_UNQUOTE(JSON_EXTRACT(p_team_roles, CONCAT('$[', i, '].user_id')));
        SET v_role = JSON_UNQUOTE(JSON_EXTRACT(p_team_roles, CONCAT('$[', i, '].role')));
        INSERT INTO Project_Roles (user_id, project_id, role)
        VALUES (v_user_id, p_project_id, v_role);
        SET i = i + 1;
    END WHILE;
    COMMIT;
END //
DELIMITER ;


# Procedure to deleted Projects
DELIMITER //
CREATE PROCEDURE procedure_to_deleted_projects(
    IN p_project_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering project and roles.';
    END;
    START TRANSACTION; 
    DELETE FROM Project_Roles WHERE project_id = p_project_id;
    DELETE FROM Meetings WHERE project_id = p_project_id;
    DELETE FROM Projects WHERE project_id = p_project_id;
    COMMIT;
END //
DELIMITER ;

# Procedure to deleted Project Role
DELIMITER //
CREATE PROCEDURE procedure_to_deleted_project_roles(
    IN p_project_role_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleted project role.';
    END;
    START TRANSACTION; 
    DELETE FROM Project_Roles WHERE project_role_id = p_project_role_id;
    COMMIT;
END //
DELIMITER ;

# Procedure to deleted Projects Roles
DELIMITER //
CREATE PROCEDURE procedure_to_list_project_roles(
    IN p_project_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error to list project and roles.';
    END;
    SELECT 
        pr.project_role_id, 
        u.fullname AS user_fullname,
        u.username,
        pr.role,
        pr.assigned_at
    FROM Project_Roles pr
    JOIN Users u ON pr.user_id = u.user_id
    WHERE pr.project_id = p_project_id;
END //
DELIMITER ;


#procedure view list project
DELIMITER //
CREATE PROCEDURE procedure_to_list_user_projects(
    IN p_project_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error listing users assigned to the project.';
    END;

    START TRANSACTION;

    SELECT 
        u.user_id,
        u.fullname AS user_fullname,
        u.email,
        pr.role,
        pr.assigned_at
    FROM Project_Roles pr
    JOIN Users u ON pr.user_id = u.user_id
    WHERE pr.project_id = p_project_id;

    COMMIT;
END //
DELIMITER ;