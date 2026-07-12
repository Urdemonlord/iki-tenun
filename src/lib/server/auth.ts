import { Lucia } from 'lucia'
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import Database from 'better-sqlite3'

const db = new Database('dev.db')

const adapter = new BetterSqlite3Adapter(db, {
	user: 'User',
	session: 'Session'
})

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: false // TODO: set true in production
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
