import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();


router.get('/secure/user', UserController.getAll);
router.post('/secure/user', (req, res) => UserController.add(req, res));
router.put('/secure/user', UserController.update);
router.delete('/secure/user/:id', UserController.delete);
router.post('/login', UserController.login);
router.post('/signup', UserController.signup);

export default router;
