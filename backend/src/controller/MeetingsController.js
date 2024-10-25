import Meetings from '../model/Meetings.js';

// Registrar una reunion
export const registerMeetigs = async (req, res, next) => {
  try {
    const { p_meeting_date, p_meeting_start_time, p_meeting_end_time, p_meeting_status, p_meeting_description, p_meeting_link, p_project_id } = req.body;
    if (!p_meeting_date || !p_meeting_start_time || !p_meeting_end_time || !p_meeting_status || !p_meeting_description || !p_meeting_link || !p_project_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    await Meetings.sequelize.query('CALL procedure_to_register_meeting_projects(:p_meeting_date, :p_meeting_start_time, :p_meeting_end_time, :p_meeting_status, :p_meeting_description, :p_meeting_link, :p_project_id)', {
      replacements: { p_meeting_date, p_meeting_start_time, p_meeting_end_time, p_meeting_status, p_meeting_description, p_meeting_link, p_project_id }
    });
    res.status(201).json({ message: 'Reunion registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar la reunion:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar una reunion
export const updatedMeetings = async (req, res) => {
  try {
    const { p_meeting_id } = req.params; // Tomar el ID de la reunión desde los parámetros de la ruta
    console.log('ID recibido para actualizar reunión:', p_meeting_id); // Depuración

    // Verificar si el ID de la reunión está presente
    if (!p_meeting_id || isNaN(p_meeting_id)) {
      return res.status(400).json({ message: 'El ID de la reunión es requerido y debe ser un número válido.' });
    }

    const {
      p_meeting_date,
      p_meeting_start_time,
      p_meeting_end_time,
      p_meeting_status,
      p_meeting_description,
      p_meeting_link
    } = req.body;

    // Verificar que al menos un campo de los datos de la reunión esté presente para actualizar
    if (!p_meeting_date && !p_meeting_start_time && !p_meeting_end_time && !p_meeting_status && !p_meeting_description && !p_meeting_link) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar.' });
    }

    // Ejecutar el procedimiento almacenado para actualizar la reunión
    await Meetings.sequelize.query(
      'CALL procedure_to_update_meeting_projects(:p_meeting_id, :p_meeting_date, :p_meeting_start_time, :p_meeting_end_time, :p_meeting_status, :p_meeting_description, :p_meeting_link)', 
      {
        replacements: {
          p_meeting_id,
          p_meeting_date: p_meeting_date || null, // Si el campo es opcional, pasamos NULL si no se proporciona
          p_meeting_start_time: p_meeting_start_time || null,
          p_meeting_end_time: p_meeting_end_time || null,
          p_meeting_status: p_meeting_status || null,
          p_meeting_description: p_meeting_description || null,
          p_meeting_link: p_meeting_link || null,
        },
      }
    );

    res.status(200).json({ message: 'Reunión actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la reunión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};





// Obtener reuniones por ID del usuario (como rol asignado y PM)
export const getMeetingsByUser = async (req, res) => {
  try {
    const p_user_id = parseInt(req.params.p_user_id, 10);  // Asegúrate de que sea un número

    // Llamar al procedimiento almacenado
    const meetings = await Meetings.sequelize.query('CALL procedure_to_get_meetings_by_user(:p_user_id)', {
      replacements: { p_user_id }
    });
    
    // Verifica que el resultado no esté vacío
    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reuniones para este usuario.' });
    }

    // Devuelve todas las reuniones
    res.status(200).json(meetings);  // Esto debería devolver todas las reuniones
  } catch (error) {
    console.error('Error al obtener reuniones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
