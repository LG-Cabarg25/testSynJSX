import { SERVIDOR } from "../services"; 

const fetchUserIdByUsername = async (username: string): Promise<number | null> => {
  try {
    const response = await fetch(`${SERVIDOR}/api/user/getByUsername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }), // Enviar el username como JSON
    });

    if (response.ok) {
      const data = await response.json();
      return data.user_id; // Asegúrate de que el backend esté devolviendo user_id correctamente
    } else {
      const errorData = await response.json();
      console.error("Error recibido del backend:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Error buscando el usuario:", error);
    return null;
  }
};

export { fetchUserIdByUsername };
