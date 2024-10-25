import { Router } from 'express';
import { registerUser, loginUser, getUserByUsername } from '../controller/UserController.js';

const router = Router();

router.post('/register', registerUser); // Ruta para registrar usuarios
router.post('/login', loginUser);       // Ruta para login de usuarios
router.post('/getByUsername', getUserByUsername);

export default router;