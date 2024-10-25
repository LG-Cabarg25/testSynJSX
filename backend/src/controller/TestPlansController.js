import TestPlans from '../model/TestPlans.js';


// Registrar un plan de pruebas
export const registerTestPlan = async (req, res, next) => {
  try {
    console.log("Datos recibidos en el body:", req.body);
    console.log("Archivo recibido:", req.file);

    const { p_project_id, p_user_id, p_plan_name, p_plan_type, p_description, p_start_date, p_end_date, p_status } = req.body;

    // Validación de campos obligatorios
    if (!p_project_id || !p_user_id || !p_plan_name || !p_status) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }

    // Verificar si se cargó un archivo
    const p_document = req.file ? req.file.filename : null; // Almacena solo el nombre del archivo
    console.log("Documento recibido:", p_document);

    // Validar que el archivo haya sido cargado
    if (!p_document) {
      return res.status(400).json({ message: 'El documento del plan de pruebas es obligatorio' });
    }

    // Crear la URL del documento
    const documentUrl = `http://localhost:8080/uploads/${p_document}`; // Usa solo el nombre del archivo

    // Ejecutar el procedimiento almacenado para registrar un plan de pruebas
    await TestPlans.sequelize.query('CALL procedure_to_register_test_plans(:p_project_id, :p_user_id, :p_plan_name, :p_plan_type, :p_description, :p_start_date, :p_end_date, :p_document, :p_status)', {
      replacements: { p_project_id, p_user_id, p_plan_name, p_plan_type, p_description, p_start_date, p_end_date, p_document: p_document, p_status }
    });

    res.status(201).json({ message: 'Plan de pruebas registrado exitosamente', document_url: documentUrl });
  } catch (error) {
    console.error('Error al registrar el plan de pruebas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener planes de pruebas por proyecto
export const getTestPlansByProject = async (req, res, next) => {
  try {
    const { p_project_id } = req.params;

    if (!p_project_id || isNaN(p_project_id)) {
      return res.status(400).json({ message: 'El ID del proyecto es requerido y debe ser un número válido.' });
    }

    const testPlans = await TestPlans.sequelize.query('CALL procedure_to_get_test_plans(:p_project_id)', {
      replacements: { p_project_id },
    });

    if (!testPlans || testPlans.length === 0) {
      return res.status(200).json([]);
    }

    // Agregar URL del documento a cada plan
    const plansWithUrls = testPlans.map(plan => ({
      ...plan,
      document_url: `http://localhost:8080/uploads/${plan.document}` // Usa solo el nombre del archivo aquí
    }));

    return res.status(200).json(plansWithUrls);
  } catch (error) {
    console.error('Error al obtener los planes de pruebas:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar un plan de pruebas
export const updateTestPlan = async (req, res, next) => {
  try {
    const { p_test_plan_id } = req.params;
    const { p_status, p_plan_type, p_description } = req.body;

    if (!p_test_plan_id || isNaN(p_test_plan_id)) {
      return res.status(400).json({ message: 'El ID del plan de pruebas es requerido y debe ser un número válido.' });
    }

    const p_document = req.file ? req.file.path : null; // Solo obtén el documento si está presente

    await TestPlans.sequelize.query('CALL procedure_to_update_test_plans(:p_test_plan_id, :p_plan_type, :p_description, :p_document, :p_status)', {
      replacements: {
        p_test_plan_id,
        p_plan_type: p_plan_type || null,
        p_description: p_description || null,
        p_document: p_document ? `http://localhost:8080/uploads/${p_document.split('\\').join('/')}` : null,
        p_status: p_status || null // Cambiado para evitar 'undefined'
      }
    });

    res.status(200).json({ message: 'Plan de pruebas actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el plan de pruebas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Eliminar un plan de pruebas
export const deleteTestPlan = async (req, res, next) => {
  try {
    const { p_test_plan_id } = req.params;

    if (!p_test_plan_id || isNaN(p_test_plan_id)) {
      return res.status(400).json({ message: 'El ID del plan de pruebas es requerido y debe ser un número válido.' });
    }

    // Ejecutar el procedimiento almacenado para eliminar un plan de pruebas
    await TestPlans.sequelize.query('CALL procedure_to_delete_test_plan(:p_test_plan_id)', {
      replacements: { p_test_plan_id }
    });

    res.status(200).json({ message: 'Plan de pruebas eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el plan de pruebas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener planes de pruebas por usuario
export const getTestPlansByUser = async (req, res, next) => {
  try {
      const userId = req.user.user_id; // Asegúrate de que esto está bien
      const testPlans = await TestPlans.sequelize.query('CALL procedure_to_get_test_plans_by_user(:p_user_id)', {
          replacements: { p_user_id: userId },
      });

      return res.status(200).json(testPlans);
  } catch (error) {
      console.error('Error al obtener los planes de pruebas:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};