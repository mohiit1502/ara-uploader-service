import { ITaskList } from '@src/models/taskList.model';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

async function getAll(): Promise<ITaskList[]> {
  console.log('taskList.repo.ts getAll called');
  const lists = await prisma.taskList.findMany();
  const mappedLists = lists.map(l => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));
  console.log('taskList.repo.ts getAll result:', mappedLists);
  return mappedLists;
}

async function getById(id: number): Promise<ITaskList | null> {
  console.log('taskList.repo.ts getById called with id:', id);
  const l = await prisma.taskList.findUnique({ where: { id } });
  if (!l) return null;
  const result = {
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
  console.log('taskList.repo.ts getById result:', result);
  return result;
}

async function create(boardId: number, list: ITaskList): Promise<ITaskList> {
  console.log('taskList.repo.ts create called with boardId:', boardId, 'list:', list);
  const l = await prisma.taskList.create({
    data: {
      name: list.name,
      boardId,
    },
  });
  const result = {
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
  console.log('taskList.repo.ts create result:', result);
  return result;
}

async function update(
  id: number,
  data: Partial<ITaskList>,
): Promise<ITaskList | null> {
  console.log('taskList.repo.ts update called with id:', id, 'data:', data);
  const updated = await prisma.taskList.updateMany({
    where: { id },
    data: { ...data },
  });
  if (updated.count > 0) {
    const l = await prisma.taskList.findUnique({ where: { id } });
    if (!l) return null;
    const result = {
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    };
    console.log('taskList.repo.ts update result:', result);
    return result;
  }
  return null;
}

async function remove(id: number): Promise<boolean> {
  console.log('taskList.repo.ts remove called with id:', id);
  const deleted = await prisma.taskList.deleteMany({ where: { id } });
  console.log('taskList.repo.ts remove completed for id:', id);
  return deleted.count > 0;
}

export default { getAll, getById, create, update, remove };
