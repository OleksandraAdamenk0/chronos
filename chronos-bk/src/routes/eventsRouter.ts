import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// controllers
import {createEventController, getEventsController, deleteEventController, getEventDetailsController, changeEventController} from "../modules/event/controller";
import {auth} from "../middleware/jwt";

// router and routes
const router = Router({ mergeParams: true });

router.get("/upcoming", dummy);
router.get("/", auth, getEventsController);
router.get("/:eventId", auth, getEventDetailsController);
router.post("/", auth, createEventController);
router.patch("/:eventId", auth, changeEventController);
router.delete("/:eventId", auth, deleteEventController);

export default router;