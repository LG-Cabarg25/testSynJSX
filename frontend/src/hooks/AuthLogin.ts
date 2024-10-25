import { SERVIDOR } from "../services";
import jwtDecode from "jwt-decode";

interface LoginData {
  username: string;
  password: string;
}

// Define la estructura esperada del token decodificado
interface DecodedToken {
  username: string;
  email: string;
}

interface User {
  username: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

const AuthLogin = async (data: LoginData): Promise<LoginResponse> => {
  const { username, password } = data;

  try {
    const response = await fetch(`${SERVIDOR}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();

      // Guarda el token en localStorage
      if (result.token) {
        localStorage.setItem("token", result.token);

        // Decodificamos el token y especificamos el tipo DecodedToken
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(
          result.token
        );
        //console.log("Token decodificado:", decodedToken); // Verificamos el contenido del token

        // Supongamos que el token contiene los datos del usuario
        const user: User = {
          username: decodedToken.username,
          email: decodedToken.email,
        };

        return {
          success: true,
          message: "Login exitoso",
          user, // Retorna el usuario decodificado
          token: result.token,
        };
      }

      return {
        success: false,
        message: "Token no proporcionado",
      };
    } else {
      const errorResponse = await response.json();
      return {
        success: false,
        message: errorResponse.message || "Error en el login",
      };
    }
  } catch (error) {
    console.error("Error en la red o servidor:", error);
    return {
      success: false,
      message: "Error en la red o servidor. Intente nuevamente.",
    };
  }
};

export default AuthLogin;
