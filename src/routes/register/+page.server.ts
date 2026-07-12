import { lucia } from '$lib/server/auth'
import { prisma } from '$lib/server/db'
import { hashSync } from 'bcryptjs'
import { redirect } from '@sveltejs/kit'
import { mergeCarts } from '$lib/server/cart'
import type { Actions } from './$types'
import { z } from 'zod/v4'

const registerSchema = z.object({
	email: z.email(),
	name: z.string().min(2),
	password: z.string().min(6)
})

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const formData = await request.formData()
		const data = Object.fromEntries(formData)
		const parsed = registerSchema.safeParse(data)
		if (!parsed.success) {
			return { success: false, error: 'Email atau password tidak valid' }
		}

		const { email, name, password } = parsed.data
		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) {
			return { success: false, error: 'Email sudah terdaftar' }
		}

		const user = await prisma.user.create({
			data: { email, name, passwordHash: hashSync(password, 10), role: 'customer' }
		})

		// Merge anonymous cart into new user cart
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
