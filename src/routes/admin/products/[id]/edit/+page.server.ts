import { prisma } from '$lib/server/db'
import { requireAdmin } from '$lib/server/auth'
import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	requireAdmin(locals.user)

	const product = await prisma.product.findUnique({
		where: { id: params.id },
		include: { images: { orderBy: { sortOrder: 'asc' } }, category: true }
	})

	if (!product) throw redirect(302, '/admin/products')

	const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })

	return { product, categories }
}

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		requireAdmin(locals.user)

		const form = await request.formData()
		const name = form.get('name') as string
		const slug = form.get('slug') as string
		const description = form.get('description') as string
		const price = parseInt(form.get('price') as string)
		const compareAtPrice = parseInt(form.get('compareAtPrice') as string) || null
		const categoryId = form.get('categoryId') as string
		const stock = parseInt(form.get('stock') as string) || 0
		const tags = (form.get('tags') as string) || ''
		const isActive = form.has('isActive')
		const isFeatured = form.has('isFeatured')
		const isNewArrival = form.has('isNewArrival')
		const imageUrls = form.getAll('imageUrls') as string[]

		if (!name || !slug || !price || !categoryId) {
			return fail(400, { error: 'Field wajib harus diisi' })
		}

		// Update product
		await prisma.product.update({
			where: { id: params.id },
			data: {
				name, slug, description, price,
				compareAtPrice: compareAtPrice || null,
				categoryId, stock, tags,
				isActive, isFeatured, isNewArrival
			}
		})

		// Replace images
		await prisma.productImage.deleteMany({ where: { productId: params.id } })
		if (imageUrls.length > 0) {
			await prisma.productImage.createMany({
				data: imageUrls.map((url, i) => ({
					url,
					alt: `${name} - Foto ${i + 1}`,
					sortOrder: i,
					productId: params.id
				}))
			})
		}

		throw redirect(302, '/admin/products')
	}
}
