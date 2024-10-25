// components/shared/dialogs/SuccessDialog.tsx

import React from 'react';

interface SuccessDialogProps {
  message: string;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">¡Éxito!</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;
