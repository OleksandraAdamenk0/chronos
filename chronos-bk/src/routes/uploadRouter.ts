import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// middleware to save files in the system
import {uploadAvatar} from "../middleware/upload";

// controllers
import {handleAvatarUpload} from "../modules/upload/controller"

// router and routes
const router = Router();

router.post('/avatar', uploadAvatar.single("avatar"), handleAvatarUpload);
router.post('/:calendarId/mail', dummy);
router.get('/accept/:token', dummy);

export default router;