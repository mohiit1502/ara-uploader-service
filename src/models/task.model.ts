// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'titleOrObj arg must be a string or an \
 	object with the appropriate task keys.';

// **** Types **** //

export interface ITask {
	id: number;
	boardId: number;
	title: string;
	description?: string;
	status: 'todo' | 'in-progress' | 'done';
	createdAt: string;
	updatedAt: string;
}

// **** Functions **** //

/**
 * Create new Task.
 */
function new_(
  boardId?: number,
  title?: string,
  status?: 'todo' | 'in-progress' | 'done',
  description?: string,
  createdAt?: string,
  updatedAt?: string,
  id?: number,
): ITask {
  const now = new Date().toISOString();
  return {
    id: (id ?? -1),
    boardId: (boardId ?? -1),
    title: (title ?? ''),
    status: (status ?? 'todo'),
    description,
    createdAt: (createdAt ?? now),
    updatedAt: (updatedAt ?? now),
  };
}

/**
 * Get task instance from object.
 */
function from(param: object): ITask {
  if (!isTask(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as ITask;
  return new_(p.boardId, p.title, p.status, p.description, p.createdAt, p.updatedAt, p.id);
}

/**
 * See if the param meets criteria to be a task.
 */
function isTask(arg: unknown): boolean {
  return (
    !!arg &&
		typeof arg === 'object' &&
		'id' in arg &&
		'boardId' in arg &&
		'title' in arg &&
		'status' in arg &&
		'createdAt' in arg &&
		'updatedAt' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isTask,
} as const;
export interface ITask {
	id: number;
	boardId: number;
	title: string;
	description?: string;
	status: 'todo' | 'in-progress' | 'done';
	createdAt: string;
	updatedAt: string;
}
