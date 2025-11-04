import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router();

router.get('/me', dummy);
router.get('/:id', dummy);
router.patch('/me', dummy);
router.delete('/me', dummy);

export default router;