import React from 'react';

const ProjectDetails: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Detalles del Proyecto</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Miembros del Equipo</h3>
        <ul>
          <li>Juan Pérez</li>
          <li>María López</li>
          <li>Carlos Sánchez</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Tareas Actuales</h3>
        <ul>
          <li>Implementación de la interfaz</li>
          <li>Pruebas unitarias</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetails;
