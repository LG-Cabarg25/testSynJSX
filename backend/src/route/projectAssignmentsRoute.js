import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerProjectAssignments, updatedProjectAssignments, deletedProjectAssignments } from '../controller/ProjectAssignmentsController.js';

const router = Router();

router.post('/register', verifyToken, registerProjectAssignments);
router.put('/update/:p_assignment_id', verifyToken, updatedProjectAssignments);
router.delete('/delete/:p_assignment_id', verifyToken, deletedProjectAssignments);

export default router;
