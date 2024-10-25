import axios from 'axios';

export const registerDefect = async (
    testCaseId: number, 
    description: string, 
    severity: string, 
    status: string, // Añadir el estado como parámetro
    token: string
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/defects/register', 
        {
          defect_description: description,
          severity: severity,
          status: status, // Incluir el estado en el cuerpo de la solicitud
          test_case_id: testCaseId
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al registrar el defecto:', error);
      throw error;
    }
  };

// Obtener los defectos por un caso de prueba específico
export const fetchDefects = async (testCaseId: number, token: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/defects/${testCaseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los defectos:', error);
    throw error;
  }
};

// Actualizar el estado de un defecto
export const updateDefect = async (defectId: number, status: string, token: string) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/defects/update/${defectId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el defecto:', error);
    throw error;
  }
};
