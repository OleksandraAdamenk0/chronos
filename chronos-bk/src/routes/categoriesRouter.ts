import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router({ mergeParams: true });

router.get('/', dummy);
router.get('/:id', dummy);
router.post('/', dummy);
router.patch('/:id', dummy);
router.delete('/:id', dummy);

export default router;