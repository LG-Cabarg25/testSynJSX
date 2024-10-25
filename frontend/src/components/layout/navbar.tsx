import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth'; // Usamos el hook para acceder al estado de autenticación
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user } = useAuth();  // Accedemos al objeto `user` del contexto
  const navigate = useNavigate();

  return (
    <div className="bg-[#042354] text-white flex justify-between items-center p-4 ">
      <div className="flex items-center  justify-center p-4 ">
        <span className="ml-4  text-xl">Usuario:</span>
        {/* Muestra el nombre de usuario si está autenticado */}
        <h1 className="text-2xl text-white font-bold ml-2">{user?.username || "Usuario"}</h1>
      </div>

      <div className="flex items-center space-x-4">


        <button onClick={() => navigate('/profile')} className="rounded-lg p-2 inline-block hover:scale-110 transition-transform">
          <img src="src/assets/icon/profiles.svg" height="40" width="40" alt="Perfil" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
