import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

// routers
import usersRouter from "./usersRouter";
import categoriesRouter from "./categoriesRouter";
import eventsRouter from "./eventsRouter";

// calendar router
const router = Router();

// sub routers
router.use('/:calendarId/users', usersRouter);
router.use('/:calendarId/categories', categoriesRouter);
router.use('/:calendarId/events', eventsRouter);

// routes
router.get('/', dummy);
router.get('/:id', dummy);
router.post('/', dummy);
router.patch('/:id', dummy);
router.delete('/:id', dummy);

export default router;