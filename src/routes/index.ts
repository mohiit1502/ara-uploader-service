import { Router } from 'express';
import boardRouter from './board.route';
import taskListRouter from './taskList.route';
import taskRouter from './task.route';
import userRouter from './user.route';

const router = Router();

router.use('/boards', boardRouter);
router.use('/tasks', taskRouter);
router.use('/users', userRouter);
router.use('/task-lists', taskListRouter);

export default router;
