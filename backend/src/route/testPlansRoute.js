import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerTestPlan, updateTestPlan, getTestPlansByProject, deleteTestPlan } from '../controller/TestPlansController.js';
import upload from '../middleware/multer.js'; // Importa multer

const router = Router();

// Rutas para registrar, actualizar y obtener planes de pruebas
router.post('/register', verifyToken, upload.single('document'), registerTestPlan); // Registrar un plan de prueba con archivo
router.put('/update/:p_test_plan_id', verifyToken, upload.single('document'), updateTestPlan); // Actualizar plan de pruebas
router.get('/project/:p_project_id', verifyToken, getTestPlansByProject); // Obtener planes de pruebas por proyecto
router.delete('/delete/:p_test_plan_id', verifyToken, deleteTestPlan);

export default router;
