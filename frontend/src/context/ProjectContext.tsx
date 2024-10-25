import { createContext, useState, ReactNode, useContext } from 'react';
import { getProjectsAssignedAndCreatedByUser, registerProject } from '../services/projectService';
import { AuthContext } from './AuthContext'; 

interface Project {
  p_project_name: string;
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  p_status: string;
  p_team_roles?: Array<{ user_id: number; role: string }>; 
}

export interface ProjectContextType {
  projects: Project[];
  addProject: (newProject: Project) => Promise<{ success: boolean; message?: string }>;
  loadProjects: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const authContext = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const loadProjects = async (): Promise<void> => {
    if (!token || !authContext?.user) {
      console.error("Token o usuario no disponible");
      return;
    }

    try {
      const data = await getProjectsAssignedAndCreatedByUser(authContext.user.user_id, token);
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar los proyectos:', error);
    }
  };

  const addProject = async (newProject: Project): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await registerProject(newProject, token!);
      setProjects([...projects, response]);
      return { success: true, message: "Proyecto registrado exitosamente" };
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      return { success: false, message: "Error en la creación del proyecto" };
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, loadProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
