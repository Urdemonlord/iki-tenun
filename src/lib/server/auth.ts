import { Lucia } from 'lucia'
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import { error } from '@sveltejs/kit'
import Database from 'better-sqlite3'
import path from 'path'

// Same DB resolution as db.ts — points to the single SQLite file
function resolveDbPath(): string {
	const raw = process.env.DATABASE_URL || 'file:./dev.db'
	const filePath = raw.replace('file:', '')
	if (filePath.startsWith('/')) return filePath
	return path.resolve(filePath)
}

const dbPath = resolveDbPath()
const db = new Database(dbPath)

const adapter = new BetterSqlite3Adapter(db, {
	user: 'User',
	session: 'Session'
})

// secure cookie: true in production (HTTPS), false in dev
const isSecure = process.env.NODE_ENV === 'production'

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: isSecure
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			name: attributes.name,
			role: attributes.role
		}
	}
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
	}
	interface UserAttributes {
		email: string
		name: string | null
		role: string
	}
}

/**
 * Guard for admin form actions.
 * Layout server load only protects GET — actions bypass it.
 * Throws 403 if no user or not admin.
 */
export function requireAdmin(user: { role: string } | null): void {
	if (!user || user.role !== 'admin') {
		throw error(403, 'Akses ditolak')
	}
}
