import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { dev } from '$app/environment'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Resolve DB path from env, fall back to prisma/dev.db
// In Docker: DATABASE_URL=file:/data/dev.db → /data/dev.db
// Locally: DATABASE_URL=file:./dev.db → resolved relative to project root
function resolveDbPath(): string {
	const raw = process.env.DATABASE_URL || 'file:./dev.db'
	// Strip 'file:' prefix
	const filePath = raw.replace('file:', '')
	// Already absolute or contains /data/ → use as-is
	if (filePath.startsWith('/')) return filePath
	// Relative → resolve from project root (not CWD)
	return path.resolve(filePath)
}

function createPrismaClient() {
	const url = resolveDbPath()
	const adapter = new PrismaBetterSqlite3({ url: `file:${url}` })
	return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (dev) globalForPrisma.prisma = prisma
