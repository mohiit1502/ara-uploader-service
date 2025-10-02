import { Router } from 'express';
import BoardController from '../controllers/board.controller';

const router = Router();

router.get('/:userId', BoardController.getBoardsByUserId);
router.get('/:userId/:boardId', BoardController.getBoardByUserId);
router.post('/:userId', BoardController.createBoard);
router.put('/:userId/:boardId', BoardController.updateBoard);
router.delete('/:userId/:boardId', BoardController.deleteBoard);

export default router;
