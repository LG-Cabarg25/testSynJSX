import React from 'react';
import { toast } from 'react-toastify';

interface InfoAlertProps {
  message: string;
}

const InfoAlert: React.FC<InfoAlertProps> = ({ message }) => {
  toast.info(message, {
    position: 'top-right',  // Ajuste de la posición correcto
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  return null;

  return null;
};

export default InfoAlert;
