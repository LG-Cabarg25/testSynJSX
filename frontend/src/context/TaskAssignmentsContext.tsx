import React, { createContext, useState, useContext } from 'react';
import { fetchTaskAssignments, registerTaskAssignment } from '../services/assignmentsService';
import { AuthContext } from './AuthContext';

interface TaskAssignment {
  assignment_id: number;
  p_nameTask: string;  // Nombre de la tarea
  p_description: string;
  p_status: string;
  p_user_id: number;
  p_project_id: number;
  p_project_role_id: number;
}

interface TaskAssignmentsContextProps {
  taskAssignments: TaskAssignment[];
  fetchTaskAssignments: (projectId: number) => Promise<TaskAssignment[]>;
  createTaskAssignment: (taskData: Omit<TaskAssignment, 'assignment_id'>) => Promise<TaskAssignment>;
}

export const TaskAssignmentsContext = createContext<TaskAssignmentsContextProps | undefined>(undefined);

export const TaskAssignmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext) || {};
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);

  const isTokenAvailable = (): boolean => {
    if (!token) {
      console.error('Token no disponible');
      return false;
    }
    return true;
  };

  const fetchAssignments = async (projectId: number): Promise<TaskAssignment[]> => {
    if (!isTokenAvailable()) return [];

    try {
      const data = await fetchTaskAssignments(projectId, token);
      setTaskAssignments(data);
      return data;
    } catch (error) {
      console.error('Error al obtener las asignaciones de tareas:', error);
      return [];
    }
  };

  const createAssignment = async (taskData: Omit<TaskAssignment, 'assignment_id'>): Promise<TaskAssignment> => {
    if (!isTokenAvailable()) throw new Error('Token no disponible');

    try {
      const newTaskAssignment = await registerTaskAssignment(taskData, token);
      setTaskAssignments((prev) => [...prev, newTaskAssignment]);
      return newTaskAssignment;
    } catch (error) {
      console.error('Error al crear la asignación de tarea:', error);
      throw error;
    }
  };

  return (
    <TaskAssignmentsContext.Provider value={{ taskAssignments, fetchTaskAssignments: fetchAssignments, createTaskAssignment: createAssignment }}>
      {children}
    </TaskAssignmentsContext.Provider>
  );
};

export const useTaskAssignments = () => {
  const context = useContext(TaskAssignmentsContext);
  if (!context) {
    throw new Error('useTaskAssignments debe usarse dentro de un TaskAssignmentsProvider');
  }
  return context;
};
