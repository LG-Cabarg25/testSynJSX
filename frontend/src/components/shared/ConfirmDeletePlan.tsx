import React from 'react';

interface ConfirmDeletePlanProps {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeletePlan: React.FC<ConfirmDeletePlanProps> = ({ projectName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Eliminar Plan de Pruebas</h2>
        <p>¿Estás seguro de que deseas eliminar el Plan de pruebas <strong>{projectName}</strong>?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePlan;
