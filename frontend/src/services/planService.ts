import axios from 'axios';
import { SERVIDOR } from './Servidor';

// Registrar un nuevo plan de pruebas
export const registerTestPlan = async (formData: FormData, token: string) => {
  try {

    const response = await axios.post(`${SERVIDOR}/api/test-plans/register`, formData, {
      headers: {
        'x-access-token': token, // El token para autenticar
        'Content-Type': 'multipart/form-data', // Para permitir la subida de archivos
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar el plan de pruebas:', error);
    throw error;
  }
};


// Actualizar un plan de pruebas existente
export const updateTestPlan = async (testPlanId: number, formData: FormData, token: string) => {
  try {
    const response = await axios.put(`${SERVIDOR}/api/test-plans/update/${testPlanId}`, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el plan de pruebas:', error);
    throw error;
  }
};

// Obtener planes de pruebas por proyecto
export const getTestPlansByProject = async (projectId: number, token: string) => {
  try {
    const response = await axios.get(`${SERVIDOR}/api/test-plans/project/${projectId}`, {
      headers: {
        'x-access-token': token, // El token para autenticar la petición
      },
    });
    return response.data; // Retorna los datos recibidos del backend
  } catch (error) {
    console.error('Error al obtener los planes de pruebas:', error);
    throw error;
  }
};

// Eliminar un plan de pruebas
export const deleteTestPlan = async (testPlanId: number, token: string) => {
  try {
    const response = await axios.delete(`${SERVIDOR}/api/test-plans/delete/${testPlanId}`, {
      headers: {
        'x-access-token': token, // El token para autenticar
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el plan de pruebas:', error);
    throw error;
  }
};