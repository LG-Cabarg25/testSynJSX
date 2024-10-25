import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getCommentsByTestCase, registerTestComment, updateTestComment } from '../controller/TestCommentsController.js';

const router = Router();

// Ruta para registrar un comentario de prueba
router.post('/register', verifyToken, registerTestComment);

// Ruta para actualizar un comentario de prueba existente
router.put('/update/:p_comment_id', verifyToken, updateTestComment);
router.get('/test-case/:test_case_id', getCommentsByTestCase);

export default router;
