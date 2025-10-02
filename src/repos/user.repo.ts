import { IUser } from '@src/models/user.model';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();


// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return {
    ...user,
    pwdHash: user.pwdHash === null ? undefined : user.pwdHash,
    role: user.role === 'Admin' ? 1 : 0,
  };
}
// removed stray closing brace

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id } });
  return !!user;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const users = await prisma.user.findMany();
  return users.map(user => ({
    ...user,
    pwdHash: user.pwdHash === null ? undefined : user.pwdHash,
    role: user.role === 'Admin' ? 1 : 0,
  }));
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  await prisma.user.create({
    data: {
      // removed leftover MockOrm code
      name: user.name,
      email: user.email,
      pwdHash: user.pwdHash,
      role: (user.role as unknown) === 1 ? 'Admin' : 'Standard',
    },
  });
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: user.name,
      email: user.email,
      pwdHash: user.pwdHash,
      role: (user.role as unknown) === 1 ? 'Admin' : 'Standard',
    },
  });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  await prisma.user.delete({ where: { id } });
}


// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
