import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

import {changeUserController, deleteUserController} from "../modules/account/controller";
import {auth} from "../middleware/jwt";

// router and routes
const router = Router();

router.get('/me', dummy);
router.get('/:id', dummy);
router.patch('/me', auth, changeUserController);
router.delete('/me', auth, deleteUserController);

export default router;