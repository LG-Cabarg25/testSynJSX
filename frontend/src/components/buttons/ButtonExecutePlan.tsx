import React from 'react';
import {  canExecuteTests } from '../../utils/roleValidations';

interface ButtonExecutePlanProps {
  userRole: string;
  onClick: () => void;
}

const ButtonExecutePlan: React.FC<ButtonExecutePlanProps> = ({ userRole, onClick }) => {
  if (!canExecuteTests(userRole)) return null; // Validamos si el usuario puede ver detalles

  return (
    <div className="relative group">
    <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
      <img src="src/assets/icon/executePlan.svg" height="30" width="30" alt="Ver Detalles del Proyecto" />
    </button>
     <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
     Ejecutar Plan de Pruebas
   </span></div>
  );
};

export default ButtonExecutePlan;
