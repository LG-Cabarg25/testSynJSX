import React from 'react';
import { canAddTask } from '../../utils/roleValidations'; // Importar la validación

interface ButtonAddTaskPlanProps {
  userRole: string;
  onClick: () => void;
}

const ButtonAddTaskPlan: React.FC<ButtonAddTaskPlanProps> = ({ userRole, onClick }) => {

  if (!canAddTask(userRole)) return null;

  return (
    <div className="relative group">
      <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
        <img src="src/assets/icon/caseTest.svg" height="30" width="30" alt="Agregar Tarea" />
      </button>
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
        Generar Caso de prueba
      </span>
    </div>
  );
};

export default ButtonAddTaskPlan;
