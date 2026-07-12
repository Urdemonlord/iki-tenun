import { prisma } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

const PAGE_SIZE = 20

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
	const total = await prisma.product.count()

	const products = await prisma.product.findMany({
		include: { category: true, images: { take: 1 } },
		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * PAGE_SIZE,
		take: PAGE_SIZE
	})

	return { products, page, totalPages: Math.ceil(total / PAGE_SIZE) }
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
