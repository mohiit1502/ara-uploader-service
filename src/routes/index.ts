import { Router } from 'express';
import userRouter from './user.route';
import imageRouter from './image.route';

const router = Router();

router.use('/', imageRouter);
router.use('/', userRouter);

export default router;
