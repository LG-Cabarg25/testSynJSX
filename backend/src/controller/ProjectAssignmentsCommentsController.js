import ProjectAssignmentsComments from '../model/ProjectAssignmentsComments.js';

// Registrar un comentario
export const registerProjectAssignmentsComments = async (req, res, next) => {
  try {
    const { p_user_id, p_assignment_id, p_comments } = req.body;

    if (!p_user_id || !p_assignment_id || !p_comments) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Inserta el comentario usando el procedimiento almacenado
    await ProjectAssignmentsComments.sequelize.query(
      'CALL procedure_to_register_project_assignments_comments(:p_user_id, :p_assignment_id, :p_comments)', {
        replacements: { p_user_id, p_assignment_id, p_comments }
      }
    );

    // Obtiene el comentario recién creado con el `created_at`
    const newComment = await ProjectAssignmentsComments.findOne({
      where: { user_id: p_user_id, assignment_id: p_assignment_id },
      order: [['created_at', 'DESC']],  // Ordena por la fecha más reciente
      attributes: ['user_id', 'assignment_id', 'comments', 'created_at'],
    });

    console.log('Nuevo comentario registrado:', newComment);

    // Devuelve el comentario recién registrado
    return res.status(201).json({
      user: newComment.user_id,
      comment: newComment.comments,
      created_at: newComment.created_at,  // Asegúrate de devolver `created_at`
    });

  } catch (error) {
    console.error('Error al registrar el comentario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.', error });
  }
};






// Actualizar un comentario
export const updatedProjectAssignmentsComments = async (req, res) => {
  try {
    const { p_project_assignments_comments_id } = req.params; // Tomar el ID del comentario desde los parámetros de la ruta

    // Verificar si el ID del comentario está presente
    if (!p_project_assignments_comments_id || isNaN(p_project_assignments_comments_id)) {
      return res.status(400).json({ message: 'El ID del comentario es requerido y debe ser un número válido.' });
    }

    const {
      p_comments,
    } = req.body;

    // Verificar que al menos un campo de los datos del comentario esté presente para actualizar
    if (!p_project_assignments_comments_id && !p_comments) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar.' });
    }

    // Ejecutar el procedimiento almacenado para actualizar el comentario
    await ProjectAssignmentsComments.sequelize.query(
      'CALL procedure_to_register_project_assignments_comments(:p_project_assignments_comments_id, :p_comments)',
      {
        replacements: {
          p_project_assignments_comments_id,
          p_comments
        },
      }
    );

    res.status(200).json({ message: 'Comentario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminar un comentario
export const deletedProjectAssignmentsComments = async (req, res) => {
  try {
    const p_project_assignments_comments_id = parseInt(req.params.p_project_assignments_comments_id, 10);

    // Asegúrate de que el ID es válido
    if (isNaN(p_project_assignments_comments_id)) {
      return res.status(400).json({ message: 'ID de comentario no válido.' });
    }

    // Llamar al procedimiento almacenado correcto
    await ProjectAssignmentsComments.sequelize.query(
      'CALL procedure_to_delete_project_assignments_comment(:p_project_assignments_comments_id)', 
      {
        replacements: { p_project_assignments_comments_id },
      }
    );

    res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};




// Mostrar comentarios de una tarea
// Mostrar comentarios de una tarea
export const fetchProjectAssignmentsComments = async (req, res) => {
  try {
    const { p_assignment_id } = req.params;

    // Verificar si el ID de la tarea es válido
    if (!p_assignment_id || isNaN(p_assignment_id)) {
      return res.status(400).json({ message: 'El ID de la tarea es obligatorio y debe ser un número válido.' });
    }

    // Llamar al procedimiento almacenado
    const result = await ProjectAssignmentsComments.sequelize.query(
      'CALL procedure_to_fetch_project_assignments_comments(:p_assignment_id)', 
      {
        replacements: { p_assignment_id },
        type: ProjectAssignmentsComments.sequelize.QueryTypes.SELECT
      }
    );

    // Procesar el resultado para convertirlo en un array
    const commentsObject = result[0];  // Aquí está el objeto con los índices
    const commentsArray = Object.keys(commentsObject).map(key => commentsObject[key]);  // Convertir a array

    // Verificar si hay comentarios en el array
    if (commentsArray.length > 0) {
      res.status(200).json(commentsArray);
    } else {
      res.status(404).json({ message: 'No se encontraron comentarios para esta asignación.' });
    }
  } catch (error) {
    console.error('Error al obtener los comentarios de la tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

