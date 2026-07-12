import { prisma } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		include: { category: true, images: { take: 1 } },
		orderBy: { createdAt: 'desc' }
	})
	return { products }
}

export const actions: Actions = {
	toggleActive: async ({ request }) => {
		const form = await request.formData()
		const id = form.get('id') as string
		const product = await prisma.product.findUnique({ where: { id } })
		if (product) {
			await prisma.product.update({ where: { id }, data: { isActive: !product.isActive } })
		}
		return { success: true }
	}
}
