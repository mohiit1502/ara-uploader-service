import { Request, Response } from 'express';
import TaskRepo from '@src/repos/task.repo';
import { ITask } from '@src/models/task.model';

class TaskController {
  // Get all tasks for a board
  public getTasksByBoardId = async (req: Request, res: Response) => {
    console.log('task.controller.ts getTasksByBoardId called with boardId:', req.params.boardId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const boardId = +req.params.boardId;
      const tasks = await TaskRepo.getTasksByBoardId(boardId);
      return res.json({ tasks });
    } catch (err) {
      console.error('task.controller.ts getTasksByBoardId error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Get single task by boardId and taskId
  public getTaskByBoardId = async (req: Request, res: Response) => {
    console.log('task.controller.ts getTaskByBoardId called with boardId:', req.params.boardId, 'taskId:', req.params.taskId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const boardId = +req.params.boardId;
      const taskId = +req.params.taskId;
      const task = await TaskRepo.getTaskByBoardId(boardId, taskId);
      return res.json({ task });
    } catch (err) {
      console.error('task.controller.ts getTaskByBoardId error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Create task for a board
  public createTask = async (req: Request, res: Response) => {
    console.log('task.controller.ts createTask called with boardId:', req.params.boardId, 'body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Dummy form validation
      const taskData = req.body as ITask;
      if (!taskData.title) {
        return res.status(400).json({ error: 'Task title required' });
      }
      const boardId = +req.params.boardId;
      const task = await TaskRepo.createTask(boardId, taskData);
      return res.status(201).json({ task });
    } catch (err) {
      console.error('task.controller.ts createTask error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Update task for a board
  public updateTask = async (req: Request, res: Response) => {
    console.log('task.controller.ts updateTask called with boardId:', req.params.boardId, 'taskId:', req.params.taskId, 'body:', req.body);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Dummy form validation
      const taskData = req.body as ITask;
      if (!taskData.title) {
        return res.status(400).json({ error: 'Task title required' });
      }
      const boardId = +req.params.boardId;
      const taskId = +req.params.taskId;
      const task = await TaskRepo.updateTask(boardId, taskId, taskData);
      return res.json({ task });
    } catch (err) {
      console.error('task.controller.ts updateTask error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };

  // Delete task for a board
  public deleteTask = async (req: Request, res: Response) => {
    console.log('task.controller.ts deleteTask called with boardId:', req.params.boardId, 'taskId:', req.params.taskId);
    try {
      if (req.headers.authorization !== 'Bearer testtoken') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const boardId = +req.params.boardId;
      const taskId = +req.params.taskId;
      await TaskRepo.deleteTask(boardId, taskId);
      return res.status(204).end();
    } catch (err) {
      console.error('task.controller.ts deleteTask error:', err);
      return res.status(500).json({ error: 'Internal server error', 
        details: String(err) });
    }
  };
}

export default new TaskController();
