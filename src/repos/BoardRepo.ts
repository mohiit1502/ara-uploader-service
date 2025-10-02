import { IBoard } from '@src/models/board.model';
import orm from './MockOrm';

async function getBoardsByUserId(userId: number): Promise<IBoard[]> {
	const db = await orm.openDb();
	return db.boards.filter((board: IBoard) => board.userId === userId);
}

async function getBoardByUserId(userId: number, boardId: number): Promise<IBoard | null> {
	const db = await orm.openDb();
	return db.boards.find((board: IBoard) => board.userId === userId && board.id === boardId) || null;
}

async function createBoard(userId: number, board: IBoard): Promise<IBoard> {
	const db = await orm.openDb();
	board.id = Date.now();
	board.userId = userId;
	board.createdAt = new Date().toISOString();
	board.updatedAt = board.createdAt;
	db.boards.push(board);
	await orm.saveDb(db);
	return board;
}

async function updateBoard(userId: number, boardId: number, boardData: Partial<IBoard>): Promise<IBoard | null> {
	const db = await orm.openDb();
	const board = db.boards.find((b: IBoard) => b.userId === userId && b.id === boardId);
	if (board) {
		Object.assign(board, boardData, { updatedAt: new Date().toISOString() });
		await orm.saveDb(db);
		return board;
	}
	return null;
}

async function deleteBoard(userId: number, boardId: number): Promise<boolean> {
	const db = await orm.openDb();
	const idx = db.boards.findIndex((b: IBoard) => b.userId === userId && b.id === boardId);
	if (idx !== -1) {
		db.boards.splice(idx, 1);
		await orm.saveDb(db);
		return true;
	}
	return false;
}

export default {
	getBoardsByUserId,
	getBoardByUserId,
	createBoard,
	updateBoard,
	deleteBoard,
};
