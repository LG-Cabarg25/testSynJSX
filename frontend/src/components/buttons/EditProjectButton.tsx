import React from 'react';
import { canEditProject } from '../../utils/roleValidations';

interface EditProjectButtonProps {
  userRole: string;
  pm_id: string;
  userId: string;
  onClick: () => void;
}

const EditProjectButton: React.FC<EditProjectButtonProps> = ({ userRole, pm_id, userId, onClick }) => {
  if (!canEditProject(userRole, pm_id, userId)) return null;

  return (
    <div className="relative group">

    <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
      <img src="src/assets/icon/config.svg" height="30" width="30" alt="Editar Proyecto" />
      <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
            Configurar Proyecto
          </span>
    </button>
    </div>
  );
};

export default EditProjectButton;
