import sequelize from '../database/database.js'; // Importa la instancia de sequelize
import TestImages from '../model/TestImages.js';

// Registrar una imagen de prueba
export const registerTestImage = async (req, res) => {
  try {
    const { p_test_case_id } = req.body;
    const { file } = req;

    if (!p_test_case_id || !file) {
      return res.status(400).json({ message: 'El ID del caso de prueba y la imagen son obligatorios' });
    }

    // Guardar la imagen en la base de datos usando el modelo directamente
    await TestImages.create({
      test_case_id: p_test_case_id,
      image: file.buffer // Los datos binarios de la imagen
    });

    res.status(201).json({ message: 'Imagen de prueba registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar la imagen de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener todas las imágenes de un caso de prueba
export const getTestImagesByTestCase = async (req, res) => {
  try {
    const { test_case_id } = req.params;

    // Consulta usando procedimiento almacenado
    const [images] = await sequelize.query('CALL procedure_get_all_test_images(:p_test_case_id)', {
      replacements: { p_test_case_id: test_case_id }
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No se encontraron imágenes para este caso de prueba.' });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error('Error al obtener las imágenes del caso de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminar una imagen de prueba por su ID
export const deleteTestImage = async (req, res) => {
  try {
    const { test_image_id } = req.params;

    const image = await TestImages.findByPk(test_image_id);

    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    await image.destroy();

    res.status(200).json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la imagen de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


