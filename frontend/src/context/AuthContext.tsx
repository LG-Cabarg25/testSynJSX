import { createContext, useState, ReactNode, useEffect } from "react";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  role: string;  // También incluimos el rol del usuario
}

interface AuthContextProps {
  user: DecodedToken | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setUser(decoded);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al decodificar el token", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
