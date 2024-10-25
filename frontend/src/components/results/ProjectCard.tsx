import React from 'react';

interface ProjectCardProps {
  project: {
    project_name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-green-50 shadow-lg rounded-lg p-4 mb-4 border-l-4 border-green-500">
      <h3 className="text-xl font-semibold text-green-700">{project.project_name}</h3>
      <p className="text-gray-800">{project.description}</p>
      <p className="text-gray-700">Inicio: {new Date(project.start_date).toLocaleDateString()}</p>
      <p className="text-gray-700">Fin: {new Date(project.end_date).toLocaleDateString()}</p>
      <p className="text-sm font-bold text-green-600 mt-2">Estado: {project.status}</p>
    </div>
  );
};

export default ProjectCard;
