import { useState } from "react";
import { SERVIDOR } from "../services";

// Definir la estructura del proyecto
interface Project {
  p_project_name: string;
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  p_status: string;
  p_team_roles?: Array<{ user_id: number; role: string }>; // Hacer opcional
}

const useProjectCreate = () => {
  const [projectId, setProjectId] = useState<number | null>(null);

  const createProject = async (newProject: Project) => {
    try {
      // Si `p_team_roles` no está definido, inicializarlo como un array vacío
      const projectData = {
        ...newProject,
        p_team_roles: newProject.p_team_roles ?? [], // Enviar un array vacío si no hay roles
      };

      const response = await fetch(`${SERVIDOR}/api/project/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData), // Enviar el proyecto con el array vacío si es necesario
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProjectId(data.projectId); // Suponiendo que el ID del proyecto viene en la respuesta como 'projectId'

      return { success: true, projectId: data.projectId };
    } catch (error) {
      console.error("Error creando el proyecto:", error);
      return { success: false };
    }
  };

  return { projectId, createProject };
};

export default useProjectCreate;
