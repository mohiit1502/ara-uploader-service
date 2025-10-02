import { Request, Response } from 'express';
import TaskListRepo from '@src/repos/taskList.repo';
import { ITaskList } from '@src/models/taskList.model';
// Extend ITaskList to include boardId for controller usage
type TaskListInput = ITaskList & { boardId: number };

class TaskListController {
  public getAll = async (_: Request, res: Response) => {
    console.log('taskList.controller.ts getAll called');
    try {
      const lists = await TaskListRepo.getAll();
      return res.json({ lists });
    } catch (err) {
      console.error('taskList.controller.ts getAll error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        details: String(err),
      });
    }
  };

  public getById = async (req: Request, res: Response) => {
    console.log('taskList.controller.ts getById called with id:', req.params.id);
    try {
      const id = +req.params.id;
      const list = await TaskListRepo.getById(id);
      return res.json({ list });
    } catch (err) {
      console.error('taskList.controller.ts getById error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        details: String(err),
      });
    }
  };

  public create = async (req: Request, res: Response) => {
    console.log('taskList.controller.ts create called with boardId:', req.body.boardId, 'body:', req.body);
    try {
      const data = req.body as TaskListInput;
      if (!data.name) {
        return res.status(400).json({ error: 'Name required' });
      }
      if (!data.boardId) {
        return res.status(400).json({ error: 'boardId required' });
      }
      const list = await TaskListRepo.create(Number(data.boardId), data);
      return res.status(201).json({ list });
    } catch (err) {
      console.error('taskList.controller.ts create error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        details: String(err),
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    console.log('taskList.controller.ts update called with id:', req.params.id, 'body:', req.body);
    try {
      const id = +req.params.id;
      const data = req.body as Partial<ITaskList>;
      const list = await TaskListRepo.update(id, data);
      return res.json({ list });
    } catch (err) {
      console.error('taskList.controller.ts update error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        details: String(err),
      });
    }
  };

  public remove = async (req: Request, res: Response) => {
    console.log('taskList.controller.ts remove called with id:', req.params.id);
    try {
      const id = +req.params.id;
      const ok = await TaskListRepo.remove(id);
      return res.json({ ok });
    } catch (err) {
      console.error('taskList.controller.ts remove error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        details: String(err),
      });
    }
  };
}

export default new TaskListController();
