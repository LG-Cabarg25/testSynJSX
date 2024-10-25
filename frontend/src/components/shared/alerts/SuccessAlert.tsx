import React from 'react';
import { toast } from 'react-toastify';

interface SuccessAlertProps {
  message: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  toast.success(message, {
    position: 'top-right',  // Ajuste de la posición correcto
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  return null;
};

export default SuccessAlert;
