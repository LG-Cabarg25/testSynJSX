import React, { useState, useContext, useEffect, useCallback } from 'react';
import ProjectCard from '../../components/projects/cards/ProjectCards';
import NewProjectModal from '../../components/projects/modals/NewProjectModal';
import ProjectFilters from '../../components/projects/filters/ProjectFilters';
import { AuthContext } from '../../context/AuthContext'; 
import { motion } from 'framer-motion';
import { getProjectsAssignedAndCreatedByUser } from '../../services/projectService';

interface Project {
  project_id: number;
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  pm_id: string;
  role?: string;  
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', assigned: false, created: false });
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const userId = user?.user_id;

  // Función para cargar los proyectos (creados y asignados)
  const loadProjects = useCallback(async () => {
    if (!userId || !token) return;

    setLoading(true);
    try {
      const projectsFromApi = await getProjectsAssignedAndCreatedByUser(userId, token);
      setProjects(projectsFromApi);
      setFilteredProjects(projectsFromApi);
    } catch {
      // Silenciar el error en producción para evitar logs no deseados
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    let filtered = [...projects];
  
    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter((project) => project.status === filters.status);
    }
  
    // Filtro para proyectos "Creados" si el usuario es PM del proyecto
    if (filters.created) {
      filtered = filtered.filter((project) => String(project.pm_id) === String(userId)); 
    }
  
    // Filtro para proyectos "Asignados" si el rol del usuario no es 'PM'
    if (filters.assigned) {
      filtered = filtered.filter((project) => project.role && project.role !== 'PM'); 
    }
  
    setFilteredProjects(filtered);
  }, [filters, projects, userId]);
  
  const handleDeleteProject = (projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.project_id !== projectId));
    setFilteredProjects((prevProjects) => prevProjects.filter((project) => project.project_id !== projectId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl text-[#042354] font-bold mb-4">Mis Proyectos</h1>

        <div className="flex items-center gap-4">
          <ProjectFilters
            onFilterChange={(newFilters) => {
              setFilters(newFilters); 
            }}
          />

          <button
            onClick={loadProjects}  
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Actualizar Dashboard
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg p-2 inline-block hover:scale-110 transition-transform"
        >
          <img src="src/assets/icon/more.svg" height="35" width="35" alt="Agregar Proyecto" />
        </button>
      </div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <p>No hay proyectos disponibles.</p>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={`${project.project_id}-${index}`} 
                projectId={project.project_id}
                p_title={project.project_name}
                p_pm_id={project.pm_id}
                p_description={project.description}
                p_status={project.status}
                p_end_date={project.end_date}
                userRoleInProject={project.role}  
                onProjectDeleted={handleDeleteProject}
              />
            ))
          )}
        </div>
      )}

      {showModal && (
        <NewProjectModal
          addProject={() => {
            setShowModal(false);  
            loadProjects();       
          }}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
