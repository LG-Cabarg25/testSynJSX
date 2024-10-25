import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { deleteTestImage,  getTestImagesByTestCase, registerTestImage } from '../controller/TestImagesController.js';
import upload from '../middleware/multer.js'; // Importa multer

const router = Router();

// Ruta para registrar una imagen de prueba
router.post('/register', verifyToken, upload.single('image'), registerTestImage);



// Ruta para obtener todas las imágenes relacionadas a un caso de prueba
router.get('/test-case/:test_case_id', verifyToken, getTestImagesByTestCase);

// Ruta para eliminar una imagen de prueba
router.delete('/:test_image_id', verifyToken, deleteTestImage);

export default router;
