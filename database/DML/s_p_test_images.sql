USE TestSync;

#VALIDADO
DELIMITER //
CREATE PROCEDURE procedure_to_register_test_image(
    IN p_test_case_id INT,
    IN p_image LONGBLOB
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering test image';
    END;

    START TRANSACTION; 
        INSERT INTO Test_Images (test_case_id, image) 
        VALUES (p_test_case_id, p_image);
    COMMIT;
END //
DELIMITER ;


#VALIDADO
DELIMITER //
CREATE PROCEDURE procedure_get_all_test_images(
    IN p_test_case_id INT
)
BEGIN
    -- Manejar errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error fetching test images';
    END;

    -- Seleccionar todas las imágenes asociadas al caso de prueba
    SELECT test_image_id, test_case_id, image
    FROM Test_Images
    WHERE test_case_id = p_test_case_id;
END //
DELIMITER ;


#VALIDADO
DELIMITER //
CREATE PROCEDURE procedure_delete_test_image(
    IN p_test_image_id INT
)
BEGIN
    -- Manejar errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting test image';
    END;

    -- Iniciar una transacción
    START TRANSACTION;
    
    -- Eliminar la imagen basada en el ID proporcionado
    DELETE FROM Test_Images WHERE test_image_id = p_test_image_id;
    
    -- Confirmar la transacción
    COMMIT;
END //
DELIMITER ;

