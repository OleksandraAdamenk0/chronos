import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router();

router.post('/register', dummy);
router.post('/login', dummy);
router.post('/logout', dummy);
router.post('/verify', dummy);
router.post('/confirm/:token', dummy);


export default router;