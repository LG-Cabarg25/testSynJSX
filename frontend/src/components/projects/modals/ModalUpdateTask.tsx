import React, { useState } from 'react';

interface ModalUpdateTaskProps {
  currentStatus: string;
  onUpdateStatus: (newStatus: string) => void;
  onClose: () => void;
}

const ModalUpdateTask: React.FC<ModalUpdateTaskProps> = ({
  currentStatus,
  onUpdateStatus,
  onClose,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleSubmit = () => {
    if (newStatus) {
      onUpdateStatus(newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Actualizar Estado de la Tarea</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        
        <div className="mt-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Nuevo Estado
          </label>
          <select
  id="status"
  value={newStatus}
  onChange={(e) => setNewStatus(e.target.value)}
  className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
>
  <option value="To do">To do</option>
  <option value="In progress">In progress</option> {/* Corrige aquí */}
  <option value="In review">In review</option> {/* Corrige aquí */}
  <option value="In testing">In testing</option> {/* Corrige aquí */}
  <option value="Returned">Returned</option>
  <option value="Approved">Approved</option>
  <option value="Rejected">Rejected</option>
</select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateTask;
