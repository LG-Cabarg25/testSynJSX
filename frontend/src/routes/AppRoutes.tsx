import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/home/HomePage'; // Ruta pública
import Dashboard from '../pages/modules/Dashboard';
import Calendar from '../pages/modules/Calendar';
import ProjectSettings from '../components/projects/ProjectSettings';
import ProjectDetails from '../components/projects/modals/ProjectDetails';
import AddTask from '../components/projects/AddTask';
import ProtectedRoute from './ProtectedRoute';
import Planning from "../pages/modules/Planning";
import Executions from "../pages/modules/Executions";
import Results from '../pages/modules/Results';
import Board from "../pages/modules/Board";


function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas con layout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/exe-test" element={<Executions />} />
          <Route path="/result" element={<Results />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/board" element={<Board />} />

          
          {/* Rutas específicas de proyectos */}
          <Route path="/project-settings/:title" element={<ProjectSettings />} />
          <Route path="/project-details/:title" element={<ProjectDetails />} />
          <Route path="/add-task/:title" element={<AddTask />} />
        </Route>

        {/* Ruta para manejar rutas no encontradas, redirigiendo al home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
