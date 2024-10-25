import ProjectAssignments from '../model/ProjectAssignments.js';

// Registrar una tarea
export const registerProjectAssignments = async (req, res, next) => {
  try {
    const { p_user_id, p_project_id, p_project_role_id, p_name_task, p_description, p_status } = req.body;
    
    if (!p_user_id || !p_project_id || !p_project_role_id || !p_name_task || !p_description || !p_status) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const result = await ProjectAssignments.sequelize.query(
      'CALL procedure_to_register_project_assignments(:p_user_id, :p_project_id, :p_project_role_id, :p_name_task, :p_description, :p_status)', 
      {
        replacements: { p_user_id, p_project_id, p_project_role_id, p_name_task, p_description, p_status }
      }
    );

    const assignmentId = result?.[0]?.assignmentId;

    if (assignmentId) {
      res.status(201).json({ success: true, assignmentId, message: 'Tarea registrada exitosamente' });
    } else {
      throw new Error('Error al obtener el ID de la tarea creada');
    }
  } catch (error) {
    console.error('Error al registrar la tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// Actualizar una tarea
export const updatedProjectAssignments = async (req, res) => {
  try {
    console.log("p_assignment_id recibido:", req.params.p_assignment_id);  // Verificar el valor recibido
    const { p_assignment_id } = req.params;

    // Validar si p_assignment_id es un número válido
    if (!p_assignment_id || isNaN(p_assignment_id)) {
      return res.status(400).json({ message: 'El ID de la asignación es requerido y debe ser un número válido.' });
    }

    const { p_status } = req.body;

    // Verificar que el estado está presente y no sea vacío
    if (!p_status) {
      return res.status(400).json({ message: 'El estado es obligatorio.' });
    }

    // Ejecutar el procedimiento almacenado
    const result = await ProjectAssignments.sequelize.query(
      'CALL procedure_to_updated_project_assignments(:p_assignment_id, :p_status)',
      {
        replacements: {
          p_assignment_id,
          p_status,
        },
      }
    );

    // Validar la respuesta del procedimiento almacenado
    if (!result || result.length === 0) {
      // Si no se encuentra la tarea o no hay resultados, responder 404
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Comprobar si el estado fue actualizado con éxito
    if (result.affectedRows === 0) {
      // Esto puede ocurrir si la tarea no fue encontrada para actualizar
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Si todo va bien, responder con éxito
    return res.status(200).json({ message: 'Tarea actualizada exitosamente' });

  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Eliminar una tarea
export const deletedProjectAssignments = async (req, res) => {
  try {
    const p_assignment_id = parseInt(req.params.p_assignment_id, 10);  // Asegúrate de que sea un número válido

    const result = await ProjectAssignments.sequelize.query(
      'CALL procedure_to_deleted_project_assignments(:p_assignment_id)', {
        replacements: { p_assignment_id }
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
