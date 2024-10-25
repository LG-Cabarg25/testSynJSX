// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      if (JSON.parse(savedState) !== isOpen) {
        toggleSidebar();
      }
    }
  }, [isOpen, toggleSidebar]);

  const handleToggleSidebar = () => {
    toggleSidebar();
    localStorage.setItem('sidebarState', JSON.stringify(!isOpen));
  };

  return (
    <div className={`bg-gray-200 h-full ${isOpen ? 'w-[250px]' : 'w-[88px]'} transition-all duration-300 flex flex-col p-3 shadow-lg`}>
      <button onClick={handleToggleSidebar} className="mb-4 p-2 focus:outline-none bg-gray-200 hover:bg-gray-300 rounded-md">
        {isOpen ? <img src="src/assets/icon/close-menu.svg" alt="Close Menu" className="h-10 w-auto" /> : <img src="src/assets/icon/open-menu.svg" alt="Open Menu" className="h-10 w-auto" />}
      </button>

      <div className="flex flex-col space-y-4">
        <button onClick={() => handleNavigation('/dashboard')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/projects.svg" alt="Proyectos" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Proyectos</span>}
        </button>
       
        <button onClick={() => handleNavigation('/calendar')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/calendar.svg" alt="Calendar" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Cronograma</span>}
        </button>

        <button onClick={() => handleNavigation('/board')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/boad.svg" alt="board" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Tablero</span>}
        </button>

        <button onClick={() => handleNavigation('/planning')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/plan.svg" alt="palan" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Planificación de Pruebas</span>}
        </button>

        <button onClick={() => handleNavigation('/exe-test')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/execute.svg" alt="execute" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Ejecución de Pruebas</span>}
        </button>

        <button onClick={() => handleNavigation('/result')} className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left">
          <img src="src/assets/icon/infop.svg" alt="result" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Resultados de Proyectos</span>}
        </button>

      </div>

      <div className="space-y-6 mt-auto">
        <button className="flex items-center bg-white p-2 rounded-lg shadow-md hover:bg-gray-300 w-full text-left" onClick={() => setShowConfirmLogout(true)}>
          <img src="src/assets/icon/logout.svg" alt="Salir" className="w-12 h-12" />
          {isOpen && <span className="ml-2 p-2 text-lg font-medium">Cerrar Sesión</span>}
        </button>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-60">
            <h2 className="text-xl mb-4">¿Seguro que quieres cerrar la sesión?</h2>
            <div className="flex justify-between">
              <button className="bg-[#042354] hover:bg-[#28559c] text-white px-4 py-2 rounded " onClick={handleLogout}>
                Cerrar Sesión
              </button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowConfirmLogout(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
