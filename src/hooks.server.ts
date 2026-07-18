import { lucia } from '$lib/server/auth'
import type { Handle } from '@sveltejs/kit'
import { randomUUID } from 'crypto'

export const handle: Handle = async ({ event, resolve }) => {
	// Security headers
	event.setHeaders({
		'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'SAMEORIGIN',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'X-XSS-Protection': '0',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	})

	// Auth — resolve user first
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (sessionId) {
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
	} else {
		event.locals.user = null
		event.locals.session = null
	}

	// Cart ID — use userId when logged in (pinned cart), otherwise cookie
	if (event.locals.user) {
		event.locals.cartId = event.locals.user.id
	} else {
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
	}

	const response = await resolve(event)

	// CSP header — allow self, Komerce, RajaOngkir, Google Fonts
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"img-src 'self' data: https:",
			"font-src 'self' https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
			"connect-src 'self' https://rajaongkir.komerce.id https://api-sandbox.collaborator.komerce.id https://api.collaborator.komerce.id",
			"frame-src 'self' https://pay-sandbox.komerce.my.id https://pay.komerce.my.id https://www.google.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		].join('; ')
	)

	return response
}
