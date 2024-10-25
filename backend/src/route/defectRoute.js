import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerDefect,  updateDefectStatus, getDefectsByTestCase } from '../controller/DefectController.js';

const router = Router();

// Registrar un nuevo defecto
router.post('/register', verifyToken, registerDefect);

// Obtener todos los defectos
router.get('/test-case/:test_case_id', verifyToken, getDefectsByTestCase);

// Actualizar el estado de un defecto
router.put('/update/:defect_id', verifyToken, updateDefectStatus);

export default router;