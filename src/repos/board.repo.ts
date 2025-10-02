import { IBoard } from '@src/models/board.model';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

async function getBoardsByUserId(userId: number): Promise<IBoard[]> {
  console.log('board.repo.ts getBoardsByUserId called with userId:', userId);
  const boards = await prisma.board.findMany({ where: { userId } });
  const mappedBoards = boards.map(b => ({
    ...b,
    description: b.description === null ? undefined : b.description,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
  console.log('board.repo.ts getBoardsByUserId result:', mappedBoards);
  return mappedBoards;
}

async function getBoardByUserId(
  userId: number,
  boardId: number,
): Promise<IBoard | null> {
  console.log('board.repo.ts getBoardByUserId called with userId:', userId, 'boardId:', boardId);
  const b = await prisma.board.findFirst({ where: { userId, id: boardId } });
  if (!b) return null;
  const result = {
    ...b,
    description: b.description === null ? undefined : b.description,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
  console.log('board.repo.ts getBoardByUserId result:', result);
  return result;
}

async function createBoard(userId: number, board: IBoard): Promise<IBoard> {
  console.log('board.repo.ts createBoard called with userId:', userId, 'board:', board);
  const b = await prisma.board.create({
    data: {
      userId,
      name: board.name,
      description: board.description,
    },
  });
  const result = {
    ...b,
    description: b.description === null ? undefined : b.description,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
  console.log('board.repo.ts createBoard result:', result);
  return result;
}

async function updateBoard(
  userId: number,
  boardId: number,
  boardData: Partial<IBoard>,
): Promise<IBoard | null> {
  console.log('board.repo.ts updateBoard called with userId:', userId, 'boardId:', boardId, 'boardData:', boardData);
  const updated = await prisma.board.updateMany({
    where: { id: boardId, userId },
    data: { ...boardData },
  });
  if (updated.count > 0) {
    const b = await prisma.board.findFirst({ where: { id: boardId, userId } });
    if (!b) return null;
    const result = {
      ...b,
      description: b.description === null ? undefined : b.description,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    };
    console.log('board.repo.ts updateBoard result:', result);
    return result;
  }
  return null;
}

async function deleteBoard(userId: number, boardId: number): Promise<boolean> {
  console.log('board.repo.ts deleteBoard called with userId:', userId, 'boardId:', boardId);
  const deleted = await prisma.board.deleteMany({
    where: { id: boardId, userId },
  });
  console.log('board.repo.ts deleteBoard completed for userId:', userId, 'boardId:', boardId);
  return deleted.count > 0;
}

export default {
  getBoardsByUserId,
  getBoardByUserId,
  createBoard,
  updateBoard,
  deleteBoard,
};
