import React from 'react';
import { canAddTask } from '../../utils/roleValidations'; // Importar la validación

interface ButtonAddTaskProps {
  userRole: string;
  onClick: () => void;
}

const ButtonAddTask: React.FC<ButtonAddTaskProps> = ({ userRole, onClick }) => {
  // Si el usuario no tiene permisos, no mostramos el botón
  if (!canAddTask(userRole)) return null;

  return (
    <div className="relative group">
      <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
        <img src="src/assets/icon/tasks.svg" height="30" width="30" alt="Agregar Tarea" />
      </button>
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
        Asignar tarea
      </span>
    </div>
  );
};

export default ButtonAddTask;
