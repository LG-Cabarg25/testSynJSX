import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerMeetigs, updatedMeetings, getMeetingsByUser } from '../controller/MeetingsController.js';

const router = Router();

router.post('/register', verifyToken, registerMeetigs);
router.put('/update/:p_meeting_id', verifyToken, updatedMeetings);

// Nueva ruta para obtener reuniones asignadas a un proyecto
router.get('/user/:p_user_id/meetings', verifyToken, getMeetingsByUser);


export default router;