import { Router } from 'express';
import TaskListController from '@src/controllers/taskList.controller';

const router = Router();

router.get('/', TaskListController.getAll);
router.get('/:id', TaskListController.getById);
router.post('/', TaskListController.create);
router.put('/:id', TaskListController.update);
router.delete('/:id', TaskListController.remove);

export default router;
