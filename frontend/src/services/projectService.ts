import axios from 'axios';
import { SERVIDOR } from './Servidor';

// Obtener los roles del equipo en un proyecto
export const getProjectRoles = async (projectId: number, token: string) => {
  try {
    const response = await axios.get(`${SERVIDOR}/api/project/${projectId}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch {
    throw new Error('Error al MOSTRAR miembro al equipo');
  }
};

// Otros servicios ya definidos
export const getProjectsAssignedAndCreatedByUser = async (userId: string, token: string) => {
  const response = await axios.get(`${SERVIDOR}/api/project/user/${userId}/assigned`, {
    headers: { 'x-access-token': token },
  });
  return response.data;
};

export const registerProject = async (newProject: JSON, token: string) => {
  try {
    const response = await axios.post(`${SERVIDOR}/api/project/register`, newProject, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if(error instanceof Error){
      console.error(
        "Error al obtener los casos de prueba:",
        error.message
      );
    }
  }
};

export const checkProjectNameExists = async (projectName: string, token: string) => {
  try {
    const response = await axios.get(`${SERVIDOR}/api/project/check/${projectName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.exists;
  } catch {
    throw new Error('Error al verificar si el nombre del proyecto existe');
  }
};

export const deleteProjectById = async (projectId: number, token: string) => {
  try {
    const response = await axios.delete(`${SERVIDOR}/api/project/delete/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch {
    throw new Error('Error al eliminar el proyecto');
  }
};

export const deleteProjectRoleById = async (projectRoleId: number, token: string) => {
  try {
    const response = await axios.delete(`${SERVIDOR}/api/project/delete-project-roles/${projectRoleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch {
    throw new Error('Error al eliminar el rol del proyecto');
  }
};

export const addTeamMember = async (projectId: number, userId: number, role: string, token: string) => {
  try {
    const response = await axios.post(
      `${SERVIDOR}/api/project/register-project-roles/${projectId}`,
      {
        p_team_roles: [{ user_id: userId, role }],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error al agregar miembro al equipo');
  }
};

export const updateTeamMemberRole = async (projectRoleId: number, role: string, token: string) => {
  try {
    const response = await axios.put(
      `${SERVIDOR}/api/project/project-role/update/${projectRoleId}`,
      { p_role: role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error al actualizar el rol del miembro');
  }
};
