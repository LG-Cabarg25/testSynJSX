import axios from 'axios';
import { SERVIDOR } from './Servidor';

// Registrar una reunión
export const registerMeeting = async (
  meetingData: {
    p_meeting_date: string;
    p_meeting_start_time: string;
    p_meeting_end_time: string;
    p_meeting_status: string;
    p_meeting_description: string;
    p_meeting_link: string;
    p_project_id: number;
  },
  token: string
) => {
  const response = await axios.post(`${SERVIDOR}/api/meeting/register`, meetingData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Actualizar una reunión
export const updateMeeting = async (
  meetingId: number,
  meetingData: {
    p_meeting_date?: string;
    p_meeting_start_time?: string;
    p_meeting_end_time?: string;
    p_meeting_status?: string;
    p_meeting_description?: string;
    p_meeting_link?: string;
  },
  token: string
) => {
  const response = await axios.put(`${SERVIDOR}/api/meeting/update/${meetingId}`, meetingData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Obtener reuniones por ID del usuario
export const getMeetingsByUserId = async (userId: number, token: string) => {
  const response = await axios.get(`${SERVIDOR}/api/meeting/user/${userId}/meetings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
