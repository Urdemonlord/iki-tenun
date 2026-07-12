import { prisma } from '$lib/server/db'
import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		include: { items: true, user: true }
	})
	if (!order) throw redirect(302, '/admin/orders')
	return { order }
}

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const form = await request.formData()
		const status = form.get('status') as string
		await prisma.order.update({ where: { id: params.id }, data: { status } })
		return { success: true }
	}
}
