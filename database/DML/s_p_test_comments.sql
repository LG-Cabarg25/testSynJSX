USE TestSync;

#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_register_test_comment(
    IN p_test_case_id INT,
    IN p_comment_text TEXT
)
BEGIN
    -- Verificamos que los valores requeridos no sean nulos
    IF p_test_case_id IS NULL OR p_comment_text IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ID del caso de prueba y el comentario son obligatorios.';
    ELSE
        -- Insertamos el comentario en la tabla commentsTestCase
        INSERT INTO commentsTestCase (test_case_id, comment_text, created_at)
        VALUES (p_test_case_id, p_comment_text, NOW());
    END IF;
END //

DELIMITER ;


#APROBADO
DELIMITER //
CREATE PROCEDURE procedure_to_get_comments_by_test_case (
    IN p_test_case_id INT
)
BEGIN
    SELECT * FROM commentsTestCase
    WHERE test_case_id = p_test_case_id;
END //
DELIMITER ;

#APROBADO
CALL procedure_to_get_comments_by_test_case(8);
