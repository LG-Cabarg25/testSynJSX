import jwt from 'jsonwebtoken';
import { secret } from '../config/config.js';

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); // Remover "Bearer " del token si está presente
  }

  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, secret); // Verifica el token con la clave secreta
    req.userId = decoded.user_id; // Asigna el user_id decodificado
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message); // Mostrar el error detallado
    return res.status(401).json({
      auth: false,
      message: 'Failed to authenticate token'
    });
  }
};

export default verifyToken;
