import axios from 'axios';
import { SERVIDOR } from '../services'; // Asegúrate de que la ruta sea correcta

// Función para registrar un nuevo caso de prueba
export const registerTestCase = async (data: {
  p_name: string;        // Nombre del caso de prueba
  p_description: string; // Descripción del caso de prueba
  p_status: string;      // Estado del caso de prueba
  p_test_plan_id: number; // ID del plan de prueba
  p_project_role_id: number; // ID del rol del proyecto
}, token: string) => {
  try {
    const response = await axios.post(`${SERVIDOR}/api/test-cases/register`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar el caso de prueba:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener todos los casos de prueba de un plan
export const fetchTestCases = async (testPlanId: number, token: string) => {
  try {
    const response = await axios.get(`${SERVIDOR}/api/test-plans/${testPlanId}/test-cases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los casos de prueba:', error.response?.data || error.message);
    throw error;
  }
};
