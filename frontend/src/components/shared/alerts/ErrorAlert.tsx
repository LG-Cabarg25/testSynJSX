import React from 'react';
import { toast } from 'react-toastify';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  toast.error(message, {
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

export default ErrorAlert;
