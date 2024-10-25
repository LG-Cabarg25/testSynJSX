import React from 'react';

interface ButtonMoveTaskProps {
  onClick: () => void;  // Función que se ejecutará al hacer clic en el botón
}

const ButtonMoveTask: React.FC<ButtonMoveTaskProps> = ({ onClick }) => {
  return (
    <div className="relative group">
      <button 
        onClick={onClick} 
        className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition"
      >
        <img 
          src="src/assets/icon/movedTask.svg" 
          height="30" 
          width="30" 
          alt="Mover Tarea" 
        />
      </button>
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
        Mover tarea
      </span>
    </div>
  );
};

export default ButtonMoveTask;
