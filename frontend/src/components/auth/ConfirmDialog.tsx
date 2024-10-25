import React from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm">
        <h3 className="text-xl font-bold mb-4">Confirmación</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-between">
          <button onClick={onConfirm} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Confirmar
          </button>
          <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
