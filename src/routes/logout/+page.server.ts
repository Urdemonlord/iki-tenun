import { lucia } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get(lucia.sessionCookieName)
		if (sessionId) {
			await lucia.invalidateSession(sessionId)
			const blank = lucia.createBlankSessionCookie()
			cookies.set(blank.name, blank.value, { path: '.', ...blank.attributes })
		}

		// Clear cart cookie so next visit gets fresh anonymous ID
		cookies.delete('cart_id', { path: '/' })
		throw redirect(302, '/login')
	}
}
