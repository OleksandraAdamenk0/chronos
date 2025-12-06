import { Router } from 'express';

import {getCategoriesController} from "../modules/category/controller";

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router({ mergeParams: true });

router.get('/', getCategoriesController);
router.get('/:id', dummy);
router.post('/', dummy);
router.patch('/:id', dummy);
router.delete('/:id', dummy);

export default router;