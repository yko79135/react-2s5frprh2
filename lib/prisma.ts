import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const resolveDatabaseUrl = () => {
  const configuredUrl = process.env.DATABASE_URL?.trim();
  if (configuredUrl) return configuredUrl;

  const dbDirectory = path.join(process.cwd(), 'prisma');
  fs.mkdirSync(dbDirectory, { recursive: true });
  return `file:${path.join(dbDirectory, 'dev.db')}`;
};

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
