import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';  // AuthProvider
import { ProjectProvider } from './context/ProjectContext';  // ProjectProvider

// Crear la raíz con createRoot
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    {/* Envuelve toda la aplicación con los providers */}
    <AuthProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </AuthProvider>
  </React.StrictMode>
);
