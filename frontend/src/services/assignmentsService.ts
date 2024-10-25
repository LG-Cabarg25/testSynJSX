import axios from 'axios';
import { SERVIDOR } from './Servidor';

// Registrar una nueva asignación de tarea
export const registerTaskAssignment = async (
  taskData: {
    p_user_id: number;
    p_project_id: number;
    p_project_role_id: number;
    p_nameTask: string;  // Nombre de la tarea
    p_description: string;  // Descripción de la tarea
    p_status: string;  // Estado de la tarea
  },
  token: string
) => {
  try {
    const response = await axios.post(`${SERVIDOR}/api/project-assignments/register`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "ERROR",
        error.message
      );
    }
    throw error;
  }
};

// Obtener todas las asignaciones de tareas de un proyecto
export const fetchTaskAssignments = async (projectId: number, token: string) => {
  try {
    const response = await axios.get(`${SERVIDOR}/api/project/${projectId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "ERROR",
        error.message
      );
    }
    throw error;
  }
};

// Actualizar una asignación de tarea
export const updateTaskAssignment = async (assignmentId: number, status: string, token: string) => {
  try {
    const response = await axios.put(`${SERVIDOR}/api/project-assignments/update/${assignmentId}`,
      { p_status: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "ERROR",
        error.message
      );
    }
    throw error;
  }
};

// Eliminar una asignación de tarea
export const deleteTaskAssignment = async (assignmentId: number, token: string) => {
  try {
    const response = await axios.delete(`${SERVIDOR}/api/project-assignments/delete/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "ERROR",
        error.message
      );
    }
    throw error;
  }
};
