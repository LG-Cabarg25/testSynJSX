import React from 'react';
import { canViewDetails } from '../../utils/roleValidations';

interface ButtonViewDetailsProps {
  userRole: string;
  onClick: () => void;
}

const ButtonViewDetails: React.FC<ButtonViewDetailsProps> = ({ userRole, onClick }) => {
  if (!canViewDetails(userRole)) return null; // Validamos si el usuario puede ver detalles

  return (
    <div className="relative group">
    <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
      <img src="src/assets/icon/details.svg" height="30" width="30" alt="Ver Detalles del Proyecto" />
    </button>
     <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
     Ver detalles
   </span></div>
  );
};

export default ButtonViewDetails;
