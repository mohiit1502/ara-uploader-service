import { Request, Response } from 'express';
import UserRepo from '@src/repos/user.repo';
import { IUser } from '@src/models/user.model';

class UserController {
  public getAll = async (req: Request, res: Response) => {
    console.log('user.controller.ts getAll called');
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const users = await UserRepo.getAll();
      return res.status(200).json({ users });
    } catch (err) {
      console.error('user.controller.ts getAll error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public add = async (req: Request, res: Response) => {
    console.log('user.controller.ts add called with body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = req.body.user as IUser;
      await UserRepo.add(user);
      return res.status(201).end();
    } catch (err) {
      console.error('user.controller.ts add error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public update = async (req: Request, res: Response) => {
    console.log('user.controller.ts update called with body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = req.body.user as IUser;
      await UserRepo.update(user);
      return res.status(200).end();
    } catch (err) {
      console.error('user.controller.ts update error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public delete = async (req: Request, res: Response) => {
    console.log('user.controller.ts delete called with id:', req.params.id);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const id = +req.params.id;
      await UserRepo.delete(id);
      return res.status(200).end();
    } catch (err) {
      console.error('user.controller.ts delete error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };
}

export default new UserController();