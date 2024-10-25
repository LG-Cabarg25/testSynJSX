// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica la autenticación, muestra un loader
  if (loading) {
    return <div>Loading...</div>; // Spinner o loader mientras se verifica autenticación
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, muestra el contenido protegido
  return children;
};

export default ProtectedRoute;
