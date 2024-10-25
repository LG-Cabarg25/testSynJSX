import React from 'react';


interface DeleteProjectButtonProps {
  onClick: () => void;
}

const DeletePlanButton: React.FC<DeleteProjectButtonProps> = ({  onClick }) => {

  return (
    <div className="relative group">
      <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
        <img src="src/assets/icon/trash.svg" height="30" width="30" alt="Eliminar Proyecto" />
      </button>
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
        Eliminar Plan
      </span>
    </div>
  );
};

export default DeletePlanButton;
