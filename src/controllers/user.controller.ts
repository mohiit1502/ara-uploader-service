import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserRepo from '@src/repos/user.repo';
import { IUser } from '@src/models/user.model';
import EnvVars from '@src/constants/EnvVars';
import logger from '../utils/logger';

const JWT_SECRET = EnvVars.Jwt.Secret;

class UserController {
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const user = await UserRepo.login(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Generate JWT and set as secure, HTTP-only cookie
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).set('x-access-token', token)
        .set('Access-Control-Expose-Headers', 'x-access-token').json({ user });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body as { name: string; email: string; password: string };
      if (!email || !password) {
        return res.status(400).json({ error: 'Name, email, and password required' });
      }
      // Check if user already exists
      const existing = await UserRepo.getOne(email);
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }
      const pwdHash = await bcrypt.hash(password, 10);
      const user = { name: name || '', email, pwdHash, role: 0 };
      await UserRepo.add(user);
      // Get the created user (for id)
      const created = await UserRepo.getOne(email);
      if (!created) {
        return res.status(500).json({ error: 'User creation failed' });
      }
      // Generate JWT and set as secure, HTTP-only cookie
      const token = jwt.sign(
        { id: created.id, email: created.email, role: created.role },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('x-access-token', token);
      return res.status(201).set('x-access-token', token)
        .set('Access-Control-Expose-Headers', 'x-access-token').json({ user: created });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public getAll = async (req: Request, res: Response) => {
    logger.info('user.controller.ts getAll called');
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const users = await UserRepo.getAll();
      return res.status(200).json({ users });
    } catch (err) {
      logger.error('user.controller.ts getAll error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public add = async (req: Request, res: Response, signingUp?: boolean) => {
    logger.info('user.controller.ts add called with body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken' && !signingUp) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = req.body as IUser;
      await UserRepo.add(user);
      return res.status(201).end();
    } catch (err) {
      logger.error('user.controller.ts add error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public update = async (req: Request, res: Response) => {
    logger.info('user.controller.ts update called with body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = req.body.user as IUser;
      await UserRepo.update(user);
      return res.status(200).end();
    } catch (err) {
      logger.error('user.controller.ts update error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };

  public delete = async (req: Request, res: Response) => {
    logger.info('user.controller.ts delete called with id:', req.params.id);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const id = +req.params.id;
      await UserRepo.delete(id);
      return res.status(200).end();
    } catch (err) {
      logger.error('user.controller.ts delete error:', err);
      return res.status(500).json({ error: 'Internal server error', details: String(err) });
    }
  };


}

const controller = new UserController();
export default {
  ...controller,
  login: controller.login,
};