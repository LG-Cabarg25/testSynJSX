import React from 'react';

interface ViewTaskAssigmentButtonProps {
  onClick: () => void;  // Función que se ejecutará al hacer clic en el botón
}

const ViewTaskAssigmentButton: React.FC<ViewTaskAssigmentButtonProps> = ({ onClick }) => {
  return (
    <div className="relative group">
      <button 
        onClick={onClick} 
        className="rounded-full p-2 bg-[#e4b4b4] hover:bg-white transition"
      >
        <img 
          src="src/assets/icon/viewTask.svg" 
          height="30" 
          width="30" 
          alt="Ver Tarea" 
        />
      </button>
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
        Ver detalles
      </span>
    </div>
  );
};

export default ViewTaskAssigmentButton;
