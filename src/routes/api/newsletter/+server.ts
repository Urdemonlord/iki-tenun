import { prisma } from '$lib/server/db'
import { fail, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData()
	const email = form.get('email') as string
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return fail(400, { error: 'Email tidak valid' })
	}
	await prisma.newsletterSubscriber.upsert({
		where: { email },
		update: {},
		create: { email }
	})
	return json({ success: true })
}
