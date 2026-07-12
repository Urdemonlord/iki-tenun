import { prisma } from '$lib/server/db'
import { error, redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const product = await prisma.product.findUnique({
		where: { slug: params.slug },
		include: {
			images: { orderBy: { sortOrder: 'asc' } },
			category: true,
			variants: true,
			reviews: {
				include: { user: { select: { name: true } } },
				orderBy: { createdAt: 'desc' }
			}
		}
	})

	if (!product) throw error(404, 'Produk tidak ditemukan')

	const related = await prisma.product.findMany({
		where: {
			categoryId: product.categoryId,
			id: { not: product.id },
			isActive: true
		},
		include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
		take: 4,
		orderBy: { createdAt: 'desc' }
	})

	const avgRating = product.reviews.length
		? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
		: null

	return { product, related, avgRating }
}

export const actions: Actions = {
	review: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { error: 'Login untuk menulis review' })

		const form = await request.formData()
		const productId = form.get('productId') as string
		const rating = parseInt(form.get('rating') as string)
		const comment = (form.get('comment') as string) || ''

		if (!rating || rating < 1 || rating > 5) return fail(400, { error: 'Rating 1-5' })

		await prisma.review.upsert({
			where: { userId_productId: { userId: locals.user.id, productId } },
			update: { rating, comment },
			create: { userId: locals.user.id, productId, rating, comment }
		})

		return { success: true }
	}
}
