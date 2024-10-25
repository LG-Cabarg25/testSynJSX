import React from 'react';

interface AddTeamProjectProps {
  userRole: string;
  onClick: () => void;
}

const AddTeamProject: React.FC<AddTeamProjectProps> = ({ userRole, onClick }) => {
  // Si el usuario no es PM, no mostramos el botón
  if (userRole !== 'PM') return null;

  return (
    <div className="relative group">
      
    <button onClick={onClick} className="rounded-full p-2 bg-[#b4c6e4] hover:bg-white transition">
      <img src="src/assets/icon/teamuser.svg" height="30" width="30" alt="Agregar Miembro al Equipo" />
    </button>
    <span className="tooltip-text group-hover:opacity-100 transition-opacity duration-300">
            Gestionar Team
          </span>
    </div>
  );
};

export default AddTeamProject;
