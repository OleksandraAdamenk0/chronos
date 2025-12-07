import { Router } from 'express';

import {getCategoriesController, createCategoryController, deleteCategoryController, changeCategoryController} from "../modules/category/controller";

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

import {auth} from "../middleware/jwt";

// router and routes
const router = Router({ mergeParams: true });

router.get('/', auth, getCategoriesController);
// router.get('/:id', dummy);
router.post('/', auth, createCategoryController);
router.patch('/:id', auth, changeCategoryController);
router.delete('/:id', auth, deleteCategoryController);

export default router;