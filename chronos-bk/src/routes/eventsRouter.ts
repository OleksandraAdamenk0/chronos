import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// controllers
import {createEventController, getEventsController} from "../modules/event/controller";
import {auth} from "../middleware/jwt";

// router and routes
const router = Router({ mergeParams: true });

router.get("/upcoming", dummy);
router.get("/", auth, getEventsController);
router.post("/", auth, createEventController);
router.patch("/:eventId", dummy);
router.delete("/:eventId", dummy);

export default router;