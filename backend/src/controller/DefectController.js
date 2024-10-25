// src/controller/DefectController.js
import sequelize from '../database/database.js';  // Asegúrate de importar sequelize

// Registrar un defecto
export const registerDefect = async (req, res) => {
  try {
    const { defect_description, severity, test_case_id } = req.body;

    if (!defect_description || !severity || !test_case_id) {
      return res.status(400).json({ message: 'La descripción, la severidad y el ID del caso de prueba son obligatorios.' });
    }

    await sequelize.query(
      'CALL procedure_to_register_defect(:p_defect_description, :p_severity, :p_status, :p_test_case_id)',
      {
        replacements: {
          p_defect_description: defect_description,
          p_severity: severity,
          p_status: 'Returned', // Si quieres que sea el valor por defecto
          p_test_case_id: test_case_id
        }
      }
    );

    res.status(201).json({ message: 'Defecto registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el defecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// Obtener defectos por test_case_id
export const getDefectsByTestCase = async (req, res) => {
  try {
    const { test_case_id } = req.params;

    // Ejecutar el procedimiento almacenado para obtener todos los defectos
    const defects = await sequelize.query('CALL procedure_get_defects_by_test_case(:p_test_case_id)', {
      replacements: { p_test_case_id: test_case_id }
    });

    // Verificar si el array está vacío o no
    if (!defects || defects.length === 0) {
      return res.status(404).json({ message: 'No se encontraron defectos para este caso de prueba.' });
    }

    // Verifica si 'defects' ya es un array, y lo devuelves tal cual
    res.status(200).json(defects);
  } catch (error) {
    console.error('Error al obtener los defectos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Actualizar el estado de un defecto
export const updateDefectStatus = async (req, res) => {
  try {
    const { defect_id } = req.params;
    const { status } = req.body;

    if (!status || !['Returned', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido.' });
    }

    await sequelize.query('CALL procedure_update_defect_status(:p_defect_id, :p_status)', {
      replacements: { p_defect_id: defect_id, p_status: status }
    });

    res.status(200).json({ message: 'Estado del defecto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del defecto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};