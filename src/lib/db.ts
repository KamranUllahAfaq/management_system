import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

let dbUrl = 'file:./dev.db';

if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  const tempDbPath = '/tmp/dev.db';
  const bundledDbPath = path.join(process.cwd(), 'dev.db');
  
  try {
    if (!fs.existsSync(tempDbPath)) {
      console.log(`Copying database from ${bundledDbPath} to ${tempDbPath}`);
      if (fs.existsSync(bundledDbPath)) {
        // Ensure parent directory exists
        fs.mkdirSync(path.dirname(tempDbPath), { recursive: true });
        fs.copyFileSync(bundledDbPath, tempDbPath);
        fs.chmodSync(tempDbPath, 0o666);
      } else {
        console.error(`Bundled database not found at ${bundledDbPath}`);
      }
    }
    dbUrl = `file:${tempDbPath}`;
  } catch (error) {
    console.error('Failed to copy database to /tmp:', error);
  }
}

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  prismaClient = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaClient = globalForPrisma.prisma;
}

export const prisma = prismaClient;
