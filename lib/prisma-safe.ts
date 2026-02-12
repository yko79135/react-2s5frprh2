import { Prisma } from '@prisma/client';

export function isPrismaUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  return error.code === 'P2021' || error.code === 'P2022';
}
