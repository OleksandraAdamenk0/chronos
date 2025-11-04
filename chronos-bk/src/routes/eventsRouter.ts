import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// router and routes
const router = Router({ mergeParams: true });

router.get("/upcoming", dummy);
router.get("/", dummy);
router.post("/", dummy);
router.patch("/:eventId", dummy);
router.delete("/:eventId", dummy);

export default router;