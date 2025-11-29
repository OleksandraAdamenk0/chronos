import { Router } from 'express';

// controllers
import {registrationController, loginController, verifyToken, confirmController, logoutController} from "../modules/auth/controller";

// router and routes
const router = Router();

router.post('/register', registrationController);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.get('/verify', verifyToken);
router.get('/confirm/:token', confirmController);

export default router;