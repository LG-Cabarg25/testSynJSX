USE TestSync;

SELECT * FROM Project_Assignments;

DELIMITER //
CREATE PROCEDURE procedure_to_register_project_assignments(
  IN p_user_id INT,
  IN p_project_id INT,
  IN p_project_role_id INT,
  IN p_name_task VARCHAR(255),  -- Nuevo parámetro para el nombre de la tarea
  IN p_description TEXT,
  IN p_status ENUM('To do', 'In progress', 'In review', 'In testing', 'Approved', 'Returned', 'Rejected')
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering Project_Assignments.';
  END;

  START TRANSACTION;
    -- Inserta la nueva tarea
    INSERT INTO Project_Assignments (user_id, project_id, project_role_id, name_task, description, status)
    VALUES (p_user_id, p_project_id, p_project_role_id, p_name_task, p_description, p_status);
    
    -- Retorna el ID de la tarea recién creada
    SELECT LAST_INSERT_ID() AS assignmentId;
  COMMIT;
END //
DELIMITER ;




DELIMITER //
CREATE PROCEDURE procedure_to_updated_project_assignments(
    IN p_assignment_id INT,
    IN p_status ENUM('To do', 'In progress', 'In review', 'In testing', 'Approved', 'Returned', 'Rejected')
)
BEGIN
    -- Iniciar la transacción
    START TRANSACTION;

    -- Actualizar el estado de la tarea y verificar si se encontró alguna fila
    UPDATE Project_Assignments
    SET status = p_status
    WHERE assignment_id = p_assignment_id;

    -- Verificar si se actualizó alguna fila
    IF ROW_COUNT() = 0 THEN
        -- No se encontró la tarea o no se actualizó nada
        ROLLBACK;
        SELECT 'Tarea no encontrada' AS message;
    ELSE
        -- Confirmar la transacción si se actualizó correctamente
        COMMIT;
        SELECT 'Tarea actualizada exitosamente' AS message;
    END IF;
END //
DELIMITER ;

DELIMITER // 
CREATE PROCEDURE procedure_to_deleted_project_assignments(
	IN p_assignment_id INT	
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting user.';
	END;
    START TRANSACTION; 
		DELETE FROM Project_Assignments WHERE assignment_id = p_assignment_id;
	COMMIT;
END //
DELIMITER ;
  
DELIMITER // 
CREATE PROCEDURE procedure_to_register_project_assignments_comments(
	IN p_user_id INT,
	IN p_assignment_id INT,
	IN p_comments TEXT
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering Project_Assignments_Comments.';
	END;
    START TRANSACTION; 
		INSERT INTO Project_Assignments_Comments (user_id, assignment_id, comments)
		VALUES (p_user_id, p_assignment_id, p_comments);
	COMMIT;
END //
DELIMITER ;

DELIMITER // 
CREATE PROCEDURE procedure_to_updated_project_assignments_comments(
	IN p_project_assignments_comments_id INT,
	IN p_comments TEXT
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating Project_Assignments_Comments.';
	END;
    START TRANSACTION; 
		UPDATE Project_Assignments_Comments
			SET comments = p_comments,
				project_assignments_comments_id = p_project_assignments_comments_id;
	COMMIT;
END //
DELIMITER ;

DELIMITER // 
CREATE PROCEDURE procedure_to_deleted_project_assignments_comments(
	IN p_project_assignments_comments_id INT	
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting Project_Assignments_Comments.';
	END;
    START TRANSACTION; 
		DELETE FROM Project_Assignments_Comments 
        WHERE project_assignments_comments_id = p_project_assignments_comments_id;
	COMMIT;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE procedure_to_get_project_assignments(IN p_project_id INT)
BEGIN
  SELECT pa.assignment_id, pa.name_task, pa.status, pa.assigned_at, u.username AS assigned_to_user
  FROM Project_Assignments pa
  JOIN Users u ON pa.user_id = u.user_id
  WHERE pa.project_id = p_project_id;
END //
DELIMITER ;

CALL procedure_to_get_project_assignments(6);

#esdf
DELIMITER //
CREATE PROCEDURE procedure_to_fetch_project_assignments_comments (
    IN p_assignment_id INT
)
BEGIN
    SELECT 
        pac.project_assignments_comments_id AS commentId,
        pac.user_id,
        u.username,
        pac.comments,
        pac.created_at
    FROM 
        Project_Assignments_Comments pac
    JOIN 
        Users u ON pac.user_id = u.user_id
    WHERE 
        pac.assignment_id = p_assignment_id  -- Asegúrate de que 'assignment_id' es la columna correcta
    ORDER BY 
        pac.created_at ASC;
END //
DELIMITER ;


DELIMITER //

CREATE PROCEDURE procedure_to_get_project_assignments(
  IN p_project_id INT
)
BEGIN
  -- Selecciona todas las tareas del proyecto
  SELECT 
    pa.assignment_id, 
    pa.name_task, 
    pa.status, 
    pa.assigned_at, 
    u.username AS assigned_to_user  -- Muestra el usuario asignado
  FROM 
    Project_Assignments pa
  LEFT JOIN 
    Users u ON pa.user_id = u.user_id  -- Asegúrate de usar LEFT JOIN para obtener todas las tareas
  WHERE 
    pa.project_id = p_project_id;  -- Filtrar por el ID del proyecto
END //

DELIMITER ;




