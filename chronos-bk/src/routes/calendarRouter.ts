import { Router } from 'express';

// dummy func to create routes quickly
import dummy from "../utils/dummyController";

import {auth} from "../middleware/jwt";
import {createCalendarController, getAllCalendarsController, getCalendarController, deleteCalendarController}
  from "../modules/calendar/controller";

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
router.get('/', auth, getAllCalendarsController);
router.get('/:id', auth, getCalendarController);
router.post('/', auth, createCalendarController);
router.patch('/:id', dummy);
router.delete('/:id', auth, deleteCalendarController);

export default router;