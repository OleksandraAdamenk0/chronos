import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// controllers
import {registrationController, loginController, verifyToken, confirmController} from "../modules/auth/controller";

// router and routes
const router = Router();

router.post('/register', registrationController);
router.post('/login', loginController);
router.get('/logout', dummy);
router.get('/verify', verifyToken);
router.get('/confirm/:token', confirmController);


export default router;