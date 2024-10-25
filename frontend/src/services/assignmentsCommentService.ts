import axios from 'axios';
import { SERVIDOR } from './Servidor';

// Registrar un comentario
export const registerProjectAssignmentComment = async (
  commentData: {
    p_user_id: number;
    p_assignment_id: number;
    p_comments: string;
  },
  token: string
) => {
  const response = await axios.post(`${SERVIDOR}/api/project-assignments-comments/register`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Actualizar un comentario
export const updateProjectAssignmentComment = async (
  commentId: number,
  updatedComment: {
    p_comments: string;
  },
  token: string
) => {
  const response = await axios.put(`${SERVIDOR}/api/project-assignments-comments/update/${commentId}`, updatedComment, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Eliminar un comentario
export const deleteProjectAssignmentComment = async (commentId: number, token: string) => {
  const response = await axios.delete(`${SERVIDOR}/api/project-assignments-comments/delete/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Obtener todos los comentarios de una asignación de tarea
export const fetchProjectAssignmentComments = async (
  assignmentId: number,
  token: string
) => {
  const response = await axios.get(`${SERVIDOR}/api/project-assignments-comments/comments/${assignmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
