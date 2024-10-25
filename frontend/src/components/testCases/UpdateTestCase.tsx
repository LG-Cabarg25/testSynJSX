import React, { useState } from 'react';

interface UpdateTestCaseProps {
  currentStatus: string;
  onClose: () => void;
  onSave: (newStatus: string) => void;
}

const UpdateTestCase: React.FC<UpdateTestCaseProps> = ({ currentStatus, onClose, onSave }) => {
  const [newStatus, setNewStatus] = useState<string>(currentStatus);

  const handleSave = () => {
    onSave(newStatus);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Actualizar Estado</h2>
        <p className="mb-4">Estado actual: <strong>{currentStatus}</strong></p>

        <label className="block mb-2">Nuevo estado:</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
        </select>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTestCase;
