import React, { useState } from 'react';

const AddTask: React.FC = () => {
  const [taskName, setTaskName] = useState('');

  const handleAddTask = () => {
    // Lógica para agregar la tarea
    console.log('Tarea agregada:', taskName);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Agregar Nueva Tarea</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre de la Tarea</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
      <button onClick={handleAddTask} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
        Agregar Tarea
      </button>
    </div>
  );
};

export default AddTask;
