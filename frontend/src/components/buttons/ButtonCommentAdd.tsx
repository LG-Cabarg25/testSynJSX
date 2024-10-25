import React from 'react';

interface ButtonCommentAddProps {
  onClick: () => void;  // Función que se ejecutará al hacer clic en el botón
}

const ButtonCommentAdd: React.FC<ButtonCommentAddProps> = ({ onClick }) => {
  return (
    <div className="relative group">
      <button 
        onClick={onClick} 
        className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition"
      >
        <img 
          src="src/assets/icon/addComment.svg" 
          height="30" 
          width="30" 
          alt="Mover Tarea" 
        />
      </button>

    </div>
  );
};

export default ButtonCommentAdd;
