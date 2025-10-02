// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must be a string or an object with the appropriate board keys.';

// **** Types **** //

export interface IBoard {
	id: number;
	userId: number;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

// **** Functions **** //

/**
 * Create new Board.
 */
function new_(
  userId?: number,
  name?: string,
  description?: string,
  createdAt?: string,
  updatedAt?: string,
  id?: number,
): IBoard {
  const now = new Date().toISOString();
  return {
    id: (id ?? -1),
    userId: (userId ?? -1),
    name: (name ?? ''),
    description,
    createdAt: (createdAt ?? now),
    updatedAt: (updatedAt ?? now),
  };
}

/**
 * Get board instance from object.
 */
function from(param: object): IBoard {
  if (!isBoard(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as IBoard;
  return new_(p.userId, p.name, p.description, p.createdAt, p.updatedAt, p.id);
}

/**
 * See if the param meets criteria to be a board.
 */
function isBoard(arg: unknown): boolean {
  return (
    !!arg &&
		typeof arg === 'object' &&
		'id' in arg &&
		'userId' in arg &&
		'name' in arg &&
		'createdAt' in arg &&
		'updatedAt' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isBoard,
} as const;
export interface IBoard {
	id: number;
	userId: number;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}
