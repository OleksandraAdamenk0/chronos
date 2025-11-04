import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router();

router.post('/:calendarId/link', dummy);
router.post('/:calendarId/mail', dummy);
router.get('/accept/:token', dummy);

export default router;