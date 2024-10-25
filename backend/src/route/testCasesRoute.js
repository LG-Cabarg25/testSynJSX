import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getTestCasesByTestPlan, registerTestCase, updateTestCase } from '../controller/TestCasesController.js';

const router = Router();

router.post('/register', verifyToken, registerTestCase);
router.put('/update/:p_test_case_id', verifyToken, updateTestCase);
router.get('/test-plan/:test_plan_id/cases', verifyToken, getTestCasesByTestPlan);

export default router;