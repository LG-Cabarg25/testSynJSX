import TestCases from '../model/TestCases.js';

// Registrar un caso de prueba
export const registerTestCase = async (req, res) => {
  try {
    const { p_test_plan_id, p_project_role_id, p_name, p_description, p_status, p_priority } = req.body;

    // Validación de campos obligatorios
    if (!p_test_plan_id || !p_project_role_id || !p_name || !p_description || !p_status || !p_priority) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Crear una nueva entrada en la base de datos
    const newTestCase = await TestCases.create({
      test_plan_id: p_test_plan_id,
      project_role_id: p_project_role_id,
      name: p_name,
      description: p_description,
      status: p_status,
      priority: p_priority
    });

    res.status(201).json({ message: 'Caso de prueba registrado exitosamente', data: newTestCase });
  } catch (error) {
    console.error('Error al registrar el caso de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// Obtener casos de prueba de un plan de pruebas
export const getTestCasesByTestPlan = async (req, res) => {
  const { test_plan_id } = req.params; // Obtener el ID del plan de prueba desde los parámetros

  try {
    // Validar que el ID sea un número
    if (isNaN(test_plan_id)) {
      return res.status(400).json({ message: 'El ID del plan de prueba es requerido y debe ser un número válido.' });
    }

    // Obtener los casos de prueba asociados al plan de pruebas
    const testCases = await TestCases.findAll({
      where: {
        test_plan_id: test_plan_id
      }
    });

    if (testCases.length === 0) {
      return res.status(404).json({ message: 'No se encontraron casos de prueba para este plan.' });
    }

    res.status(200).json(testCases); // Devolver los casos de prueba
  } catch (error) {
    console.error('Error al obtener los casos de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar un caso de prueba
export const updateTestCase = async (req, res) => {
  try {
    // Log para verificar qué parámetros y datos están llegando al servidor
    console.log('Parámetros recibidos:', req.params); 
    console.log('Cuerpo de la solicitud:', req.body);

    const { p_test_case_id } = req.params;  // Accedemos al ID usando p_test_case_id, como llega en los parámetros

    if (!p_test_case_id || isNaN(p_test_case_id)) {
      console.log('ID inválido:', p_test_case_id);  // Log para identificar el ID
      return res.status(400).json({ message: 'El ID del caso de prueba es requerido y debe ser un número válido.' });
    }

    const { p_status } = req.body;

    if (!p_status) {
      return res.status(400).json({ message: 'El estado del caso de prueba es requerido.' });
    }

    // Realiza la actualización
    const updated = await TestCases.update(
      { status: p_status },
      { where: { test_case_id: parseInt(p_test_case_id) } } // Asegúrate de que el ID esté correcto
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Caso de prueba no encontrado' });
    }

    res.status(200).json({ message: 'Caso de prueba actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el caso de prueba:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
