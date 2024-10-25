import React, { useState } from 'react';

const ProjectSettings: React.FC = () => {
  const [projectName, setProjectName] = useState('Proyecto X');
  const [description, setDescription] = useState('Descripción del proyecto');

  const handleSave = () => {
    // Aquí se puede manejar la lógica para guardar las configuraciones
    console.log('Configuración guardada');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Configuración del Proyecto</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Guardar
      </button>
    </div>
  );
};

export default ProjectSettings;
