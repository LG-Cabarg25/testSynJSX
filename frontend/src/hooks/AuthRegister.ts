import { SERVIDOR } from "../services"; // Verifica si el path es correcto

// Definir el tipo de datos esperados para el registro
interface RegisterData {
  fullname: string; // Incluir fullname
  username: string;
  email: string;
  password: string;
}

// Definir el tipo de respuesta esperada
interface RegisterResponse {
  success: boolean;
  message: string;
}

const AuthRegister = async (data: RegisterData): Promise<RegisterResponse> => {
  const { fullname, username, email, password } = data;

  try {
    const response = await fetch(`${SERVIDOR}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        username,
        email, // Verifica que estés enviando el email
        password,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      return { success: true, message: "Registro exitoso" };
    } else {
      const errorResponse = await response.json();
      return {
        success: false,
        message: errorResponse.message || "Error en el registro",
      };
    }
  } catch (error) {
    console.error("Error de red:", error);
    return { success: false, message: "Error de red" };
  }
};

export default AuthRegister;
