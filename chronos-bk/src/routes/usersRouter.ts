import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router({ mergeParams: true });

router.get('/', dummy);
router.get('/:userId', dummy);
router.patch('/:userId', dummy);
router.delete('/:userId', dummy);

export default router;