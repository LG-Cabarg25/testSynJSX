USE TestSync;

# Procedure to register meetigns
DELIMITER //
CREATE PROCEDURE procedure_to_register_meeting_projects(
    IN p_meeting_date DATE,
    IN p_meeting_start_time TIME,
    IN p_meeting_end_time TIME,
    IN p_meeting_status ENUM ('Pending', 'Completed'),
    IN p_meeting_description TEXT,
    IN p_meeting_link TEXT,
    IN p_project_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering project and roles.';
    END;
    START TRANSACTION; 
		INSERT INTO Meetings (
			meeting_date, 
            meeting_start_time, 
            meeting_end_time, 
            meeting_status, 
            meeting_description, 
            meeting_link, 
            project_id) VALUES (
				p_meeting_date,
				p_meeting_start_time,
				p_meeting_end_time,
                p_meeting_status,
                p_meeting_description,
                p_meeting_link,
                p_project_id);
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_meeting_projects(
    IN p_meeting_id INT,
    IN p_meeting_date DATE,
    IN p_meeting_start_time TIME,
    IN p_meeting_end_time TIME,
    IN p_meeting_status ENUM ('Pending', 'Completed'),
    IN p_meeting_description TEXT,
    IN p_meeting_link TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating meeting.';
    END;
    START TRANSACTION; 

    -- Actualizar solo los campos que no son NULL
    UPDATE Meetings 
    SET 
        meeting_date = IFNULL(p_meeting_date, meeting_date), 
        meeting_start_time = IFNULL(p_meeting_start_time, meeting_start_time), 
        meeting_end_time = IFNULL(p_meeting_end_time, meeting_end_time), 
        meeting_status = IFNULL(p_meeting_status, meeting_status), 
        meeting_description = IFNULL(p_meeting_description, meeting_description), 
        meeting_link = IFNULL(p_meeting_link, meeting_link)
    WHERE meeting_id = p_meeting_id;

    COMMIT;
END //
DELIMITER ;


#PROCEDURE VIEW MEETING
DELIMITER //
CREATE PROCEDURE procedure_to_get_meetings_by_user(
    IN p_user_id INT
)
BEGIN
    START TRANSACTION;

    -- Seleccionar todas las reuniones asociadas a los proyectos donde el usuario tiene un rol asignado
    SELECT m.meeting_id, m.meeting_date, m.meeting_start_time, m.meeting_end_time, 
           m.meeting_status, m.meeting_description, m.meeting_link, m.project_id
    FROM Meetings m
    INNER JOIN Project_Roles pr ON m.project_id = pr.project_id
    WHERE pr.user_id = p_user_id
    
    UNION

    -- Seleccionar todas las reuniones asociadas a los proyectos donde el usuario es PM (usando pm_id)
    SELECT m.meeting_id, m.meeting_date, m.meeting_start_time, m.meeting_end_time, 
           m.meeting_status, m.meeting_description, m.meeting_link, m.project_id
    FROM Meetings m
    INNER JOIN Projects p ON m.project_id = p.project_id
    WHERE p.pm_id = p_user_id;

    COMMIT;
END //
DELIMITER ;