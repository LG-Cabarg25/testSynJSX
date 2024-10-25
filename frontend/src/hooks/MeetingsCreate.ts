import { useState, useContext } from "react";
import { registerMeeting } from "../services/meetingService"; // Importa el servicio
import { AuthContext } from "../context/AuthContext";

interface Meeting {
  p_meeting_date: string;
  p_meeting_start_time: string;
  p_meeting_end_time: string;
  p_meeting_status: string;
  p_meeting_description: string;
  p_meeting_link: string;
  p_project_id: number;
}

const useMeetingCreate = () => {
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const { token } = useContext(AuthContext); // Obtén el token desde el contexto

  const createMeeting = async (newMeeting: Meeting) => {
    if (!token) {
      console.error("Token no disponible");
      return { success: false };
    }

    try {
      const data = await registerMeeting(newMeeting, token); // Usa el servicio
      setMeetingId(data.meetingId); // Asumiendo que 'meetingId' está en la respuesta
      return { success: true, meetingId: data.meetingId };
    } catch (error) {
      console.error("Error creando la reunión:", error);
      return { success: false };
    }
  };

  return { meetingId, createMeeting };
};

export default useMeetingCreate;
