import { lucia } from '$lib/server/auth'
import type { Handle } from '@sveltejs/kit'
import { randomUUID } from 'crypto'

export const handle: Handle = async ({ event, resolve }) => {
	// Anonymous cart cookie
	let cartId = event.cookies.get('cart_id')
	if (!cartId) {
		cartId = randomUUID()
		event.cookies.set('cart_id', cartId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		})
	}
	event.locals.cartId = cartId

	// Auth
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await lucia.validateSession(sessionId)
	if (session?.fresh) {
		const c = lucia.createSessionCookie(session.id)
		event.cookies.set(c.name, c.value, { path: '/', ...c.attributes })
	}
	if (!session) {
		const c = lucia.createBlankSessionCookie()
		event.cookies.set(c.name, c.value, { path: '/', ...c.attributes })
	}

	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}
