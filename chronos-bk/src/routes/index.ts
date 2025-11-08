import { Router, Request, Response, NextFunction } from 'express';

// routers
import accountRouter from "./accountRouter";
import authRouter from "./authRouter";
import calendarRouter from "./calendarRouter";
import inviteRouter from "./inviteRouter";
import uploadRouter from "./uploadRouter";

// main router
const router = Router();

/* Server test. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('index');
});

// routes
router.use('/account', accountRouter);
router.use('/auth', authRouter);
router.use('/calendar', calendarRouter);
router.use('/invite', inviteRouter);
router.use('/upload', uploadRouter);

export default router;
