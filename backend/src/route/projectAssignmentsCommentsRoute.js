import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerProjectAssignmentsComments, updatedProjectAssignmentsComments, deletedProjectAssignmentsComments, fetchProjectAssignmentsComments } from '../controller/ProjectAssignmentsCommentsController.js';

const router = Router();

router.post('/register', verifyToken, registerProjectAssignmentsComments);
router.put('/update/:p_project_assignments_comments_id', verifyToken, updatedProjectAssignmentsComments);
router.delete('/delete/:p_project_assignments_comments_id', verifyToken, deletedProjectAssignmentsComments);
router.get('/comments/:p_assignment_id', verifyToken, fetchProjectAssignmentsComments);

export default router;