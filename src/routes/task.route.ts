
import { Router } from 'express';
import TaskController from '../controllers/task.controller';

const router = Router();

router.get('/:boardId', TaskController.getTasksByBoardId);
router.get('/:boardId/:taskId', TaskController.getTaskByBoardId);
router.post('/:boardId', TaskController.createTask);
router.put('/:boardId/:taskId', TaskController.updateTask);
router.delete('/:boardId/:taskId', TaskController.deleteTask);

export default router;
