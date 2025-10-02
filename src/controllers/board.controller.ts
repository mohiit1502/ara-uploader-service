import { Request, Response } from 'express';
import BoardRepo from '@src/repos/board.repo';
import { IBoard } from '@src/models/board.model';

class BoardController {
  // Get all boards for a user
  public getBoardsByUserId = async (req: Request, res: Response) => {
    console.log('board.controller.ts getBoardsByUserId called with userId:', req.params.userId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = +req.params.userId;
      const boards = await BoardRepo.getBoardsByUserId(userId);
      return res.json({ boards });
    } catch (err) {
      console.error('board.controller.ts getBoardsByUserId error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Get single board by userId and boardId
  public getBoardByUserId = async (req: Request, res: Response) => {
    console.log('board.controller.ts getBoardByUserId called with userId:', req.params.userId, 'boardId:', req.params.boardId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = +req.params.userId;
      const boardId = +req.params.boardId;
      const board = await BoardRepo.getBoardByUserId(userId, boardId);
      return res.json({ board });
    } catch (err) {
      console.error('board.controller.ts getBoardByUserId error:', err);
      return res.status(500).json({ error: 'Internal server error',
        details: String(err) });
    }
  };

  // Create board for a user
  public createBoard = async (req: Request, res: Response) => {
    console.log('board.controller.ts createBoard called with userId:', req.params.userId, 'body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const boardData = req.body as IBoard;
      if (!boardData.name) {
        return res.status(400).json({ error: 'Board name required' });
      }
      const userId = +req.params.userId;
      const board = await BoardRepo.createBoard(userId, boardData);
      return res.status(201).json({ board });
    } catch (err) {
      console.error('board.controller.ts createBoard error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Update board for a user
  public updateBoard = async (req: Request, res: Response) => {
    console.log('board.controller.ts updateBoard called with userId:', req.params.userId, 'boardId:', req.params.boardId, 'body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const boardData = req.body as IBoard;
      if (!boardData.name) {
        return res.status(400).json({ error: 'Board name required' });
      }
      const userId = +req.params.userId;
      const boardId = +req.params.boardId;
      const board = await BoardRepo.updateBoard(userId, boardId, boardData);
      return res.json({ board });
    } catch (err) {
      console.error('board.controller.ts updateBoard error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Delete board for a user
  public deleteBoard = async (req: Request, res: Response) => {
    console.log('board.controller.ts deleteBoard called with userId:', req.params.userId, 'boardId:', req.params.boardId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = +req.params.userId;
      const boardId = +req.params.boardId;
      await BoardRepo.deleteBoard(userId, boardId);
      return res.status(204).end();
    } catch (err) {
      console.error('board.controller.ts deleteBoard error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };
}

export default new BoardController();
