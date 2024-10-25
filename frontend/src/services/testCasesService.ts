import axios from "axios";
import { SERVIDOR } from "./Servidor"; // Asegúrate de que la ruta sea correcta

// Función para registrar un nuevo caso de prueba
export const registerTestCase = async (
  data: {
    p_name: string; // Nombre del caso de prueba
    p_description: string; // Descripción del caso de prueba
    p_status: string; // Estado del caso de prueba
    p_test_plan_id: number; // ID del plan de prueba
    p_project_role_id: number; // ID del rol del proyecto
  },
  token: string
) => {
  try {
    const response = await axios.post(
      `${SERVIDOR}/api/test-cases/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los casos de prueba:", error.message);
    }
    throw error;
  }
};

// Función para obtener todos los casos de prueba de un plan
export const fetchTestCases = async (testPlanId: number, token: string) => {
  try {
    const response = await axios.get(
      `${SERVIDOR}/api/test-plans/${testPlanId}/test-cases`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los casos de prueba:", error.message);
    }
    throw error;
  }
};

// Función para eliminar un caso de prueba
export const deleteTestCase = async (testCaseId: number, token: string) => {
  try {
    const response = await axios.delete(
      `${SERVIDOR}/api/test-cases/delete/${testCaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los casos de prueba:", error.message);
    }
    throw error;
  }
};

// Función para obtener todos los casos de prueba de un plan
export const fetchTestCasesByPlan = async (
  testPlanId: number,
  token: string
) => {
  try {
    const response = await axios.get(
      `${SERVIDOR}/api/test-cases/test-plan/${testPlanId}/cases`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Retorna los datos de los casos de prueba
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los casos de prueba:", error.message);
    }
    throw error;
  }
};

// Frontend: Enviar p_status en lugar de status
export const updateTestCase = async (
  testCaseId: number,
  data: { status: unknown },
  token: string
) => {
  try {
    const response = await axios.put(
      `${SERVIDOR}/api/test-cases/update/${testCaseId}`,
      { p_status: data.status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "Error al obtener los casos de prueba:",
        error.message
      );
    }
    throw error;
  }
};

// Subir una imagen para un caso de prueba
export const uploadTestCaseImage = async (
  formData: FormData,
  token: string
) => {
  const response = await axios.post(
    `${SERVIDOR}/api/test-case-images/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Actualizar el avance del caso de prueba
export const updateTestCaseProgress = async (
  data: { test_case_id: number; progress: number },
  token: string
) => {
  const response = await axios.put(
    `${SERVIDOR}/api/test-cases/${data.test_case_id}/progress`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
