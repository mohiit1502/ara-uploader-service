import { ITask } from '@src/models/task.model';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

async function getTasksByBoardId(boardId: number): Promise<ITask[]> {
  const tasks = await prisma.task.findMany({ where: { boardId } });
  return tasks.map(t => ({
    ...t,
    description: t.description === null ? undefined : t.description,
    status: t.status === 'in_progress' ? 'in-progress' : t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));
}

async function getTaskByBoardId(boardId: number, taskId: number):
  Promise<ITask | null> {
  const t = await prisma.task.findFirst({ where: { boardId, id: taskId } });
  if (!t) return null;
  return {
    ...t,
    description: t.description === null ? undefined : t.description,
    status: t.status === 'in_progress' ? 'in-progress' : t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

async function createTask(boardId: number, task: ITask): Promise<ITask> {
  const prismaStatus = task.status === 'in-progress' ? 'in_progress' :
    task.status;
  console.log('task.repo.ts createTask called with task:', task);
  const t = await prisma.task.create({
    data: {
      boardId,
      title: task.title,
      description: task.description,
      status: prismaStatus,
    },
  });
  console.log('task.repo.ts createTask result:', t);
  return {
    ...t,
    description: t.description === null ? undefined : t.description,
    status: t.status === 'in_progress' ? 'in-progress' : t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

async function updateTask(
  boardId: number,
  taskId: number,
  taskData: Partial<ITask>,
): Promise<ITask | null> {
  console.log('task.repo.ts updateTask called with taskId:', taskId, 'and taskData:', taskData);
  const updateData: Partial<ITask> = { ...taskData };
  // Remove id if present
  delete updateData.id;
  // Map status to Prisma enum
  if (updateData.status === 'in-progress') updateData.status = 'in-progress';
  const updated = await prisma.task.updateMany({
    where: { id: taskId, boardId },
    data: updateData as number,
  });
  if (updated.count > 0) {
    const t = await prisma.task.findFirst({ where: { id: taskId, boardId } });
    if (!t) return null;
    console.log('task.repo.ts updateTask result:', t);
    return {
      ...t,
      description: t.description === null ? undefined : t.description,
      status: t.status === 'in_progress' ? 'in-progress' : t.status,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }
  return null;
}

async function deleteTask(boardId: number, taskId: number): Promise<boolean> {
  console.log('task.repo.ts deleteTask called with taskId:', taskId);
  const deleted = await prisma.task.deleteMany({
    where: { id: taskId, boardId },
  });
  console.log('task.repo.ts deleteTask completed for taskId:', taskId);
  return deleted.count > 0;
}

export default {
  getTasksByBoardId,
  getTaskByBoardId,
  createTask,
  updateTask,
  deleteTask,
};
