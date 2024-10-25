import React from 'react';

interface EditPlanButtonProps {
  userRole: string;
  onClick: () => void;
}

const EditPlanButton: React.FC<EditPlanButtonProps> = ({ userRole, onClick }) => {
  // Solo mostrar el botón si el usuario tiene el rol de QA
  if (userRole !== 'QA') {
    return null; // No mostrar el botón si no es QA
  }

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition"
      >
        <img src="src/assets/icon/createplan.svg" height="30" width="30" alt="Crear Plan de Pruebas" />
        <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
          Editar Plan de Pruebas
        </span>
      </button>
    </div>
  );
};

export default EditPlanButton;
