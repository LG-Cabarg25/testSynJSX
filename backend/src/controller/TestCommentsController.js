import sequelize from '../database/database.js'; // Importa la instancia de sequelize
import TestComments from '../model/TestComments.js';

// Registrar un comentario de prueba
export const registerTestComment = async (req, res) => {
  try {
    const { p_test_case_id, p_comment_text } = req.body;

    if (!p_test_case_id || !p_comment_text) {
      return res.status(400).json({ message: 'El ID del caso de prueba y el comentario son obligatorios.' });
    }

    await TestComments.create({
      test_case_id: p_test_case_id,
      comment_text: p_comment_text
    });

    res.status(201).json({ message: 'Comentario de prueba registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el comentario de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar un comentario de prueba
export const updateTestComment = async (req, res) => {
  try {
    const { p_comment_id } = req.params;
    const { p_comment_text } = req.body;

    if (!p_comment_id || isNaN(p_comment_id)) {
      return res.status(400).json({ message: 'El ID del comentario de prueba es requerido y debe ser un número válido.' });
    }

    if (!p_comment_text) {
      return res.status(400).json({ message: 'El texto del comentario es obligatorio.' });
    }

    const updated = await TestComments.update(
      { comment_text: p_comment_text },
      { where: { comment_id: p_comment_id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Comentario de prueba no encontrado.' });
    }

    res.status(200).json({ message: 'Comentario de prueba actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el comentario de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Obtener comentarios por test_case_id usando el procedimiento almacenado
export const getCommentsByTestCase = async (req, res) => {
  try {
    const { test_case_id } = req.params;

    if (!test_case_id || isNaN(test_case_id)) {
      return res.status(400).json({ message: 'El ID del caso de prueba es requerido y debe ser un número válido.' });
    }

    // Llamar al procedimiento almacenado
    const comments = await sequelize.query('CALL procedure_to_get_comments_by_test_case(:test_case_id)', {
      replacements: { test_case_id }
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para este caso de prueba.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};