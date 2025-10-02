

import jsonfile from 'jsonfile';

import { IUser } from '@src/models/user.model';
import { IBoard } from '@src/models/board.model';
import { ITask } from '@src/models/task.model';
import { ITaskList } from '@src/models/taskList.model';


// **** Variables **** //

const DB_FILE_NAME = 'database.json';


// **** Types **** //

interface IDb {
  users: IUser[];
  boards: IBoard[];
  tasks: ITask[];
  taskLists: ITaskList[];
}


// **** Functions **** //

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/**
 * Update the file.
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}


// **** Export default **** //

export default {
  openDb,
  saveDb,
} as const;
