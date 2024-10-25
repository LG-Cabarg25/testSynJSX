import React, { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Controla si el sidebar está abierto o cerrado

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Cambia el estado del sidebar
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        <Navbar />
        <div className="p-6 flex-1 overflow-auto bg-gray-50">
          <Outlet /> {/* Renderiza el contenido de las rutas hijas */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
