import { useState, useContext } from 'react';
import { registerTaskAssignment } from '../services/assignmentsService'; // Importa el servicio de registro
import { AuthContext } from '../context/AuthContext'; // Token de autenticación

interface TaskAssignment {
  p_user_id: number;
  p_project_id: number;
  p_project_role_id: number;
  p_nameTask: string;  // Nuevo campo
  p_description: string;
  p_status: string;
}

const useTaskAssignmentCreate = () => {
  const [taskAssignmentId, setTaskAssignmentId] = useState<number | null>(null);
  const { token } = useContext(AuthContext);

  const createTaskAssignment = async (newTask: TaskAssignment) => {
    if (!token) {
      console.error('Token no disponible');
      return { success: false, message: 'Token no disponible' };
    }

    try {
      const data = await registerTaskAssignment(newTask, token);
      if (data?.assignmentId) {
        setTaskAssignmentId(data.assignmentId);
        return { success: true, assignmentId: data.assignmentId };
      } else {
        return { success: false, message: 'ID de tarea no encontrado en la respuesta' };
      }
    } catch (error) {
      console.error('Error creando la tarea:', error);
      return { success: false, message: 'Error creando la tarea' };
    }
  };

  return { taskAssignmentId, createTaskAssignment };
};

export default useTaskAssignmentCreate;