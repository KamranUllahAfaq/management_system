import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
  prismaClient = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaClient = globalForPrisma.prisma;
}

export const prisma = prismaClient;
