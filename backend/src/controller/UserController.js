import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../model/Users.js';
import { secret } from '../config/config.js';

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body; // Asegúrate de extraer correctamente el email

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario o email ya existen
    const existingEmail = await Users.findOne({ where: { email } });
    const existingUsername = await Users.findOne({ where: { username } });

    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    if (existingUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = await Users.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar al usuario por su nombre de usuario
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Verificar la contraseña
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generar un token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ auth: true, token });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.body; // Extraer el username del cuerpo de la solicitud
  try {
    // Buscar al usuario por nombre de usuario
    const user = await Users.findOne({ where: { username } });

    if (user) {
      // Si el usuario existe, devolver su ID
      res.json({ user_id: user.user_id });
    } else {
      // Si no se encuentra, devolver un error 404
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
};