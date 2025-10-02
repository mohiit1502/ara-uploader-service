import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/', UserController.getAll);
router.post('/', UserController.add);
router.put('/', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
