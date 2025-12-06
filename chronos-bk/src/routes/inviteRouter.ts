import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

import {invitationLinkController, invitationEmailController, acceptInvitationController} from "../modules/invite/controller";
import {auth} from "../middleware/jwt";

// router and routes
const router = Router();

router.post('/:calendarId/link', auth, invitationLinkController);
router.post('/:calendarId/mail', auth, invitationEmailController);
router.get('/accept/:token', auth, acceptInvitationController);

export default router;