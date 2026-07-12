import { lucia } from '$lib/server/auth'
import { prisma } from '$lib/server/db'
import { compareSync } from 'bcryptjs'
import { redirect, fail } from '@sveltejs/kit'
import { mergeCarts } from '$lib/server/cart'
import { z } from 'zod/v4'
import type { Actions, PageServerLoad } from './$types'

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1)
})

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')
	return {}
}

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const formData = await request.formData()
		const parsed = loginSchema.safeParse(Object.fromEntries(formData))
		if (!parsed.success) {
			return fail(400, { error: 'Email atau password tidak valid' })
		}

		const { email, password } = parsed.data

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user || !compareSync(password, user.passwordHash)) {
			return fail(400, { error: 'Email atau password salah' })
		}

		// Merge anonymous cart into user cart before creating session
		const anonCartId = locals.cartId
		if (anonCartId !== user.id) {
			await mergeCarts(anonCartId, user.id)
		}

		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies.set(sessionCookie.name, sessionCookie.value, { path: '.', ...sessionCookie.attributes })

		throw redirect(302, '/')
	}
}
