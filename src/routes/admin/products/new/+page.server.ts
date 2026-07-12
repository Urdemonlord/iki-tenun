import { prisma } from '$lib/server/db'
import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const categories = await prisma.category.findMany()
	return { categories }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const name = form.get('name') as string
		const slug = form.get('slug') as string
		const description = form.get('description') as string
		const price = parseInt(form.get('price') as string)
		const compareAtPrice = parseInt(form.get('compareAtPrice') as string) || null
		const categoryId = form.get('categoryId') as string
		const stock = parseInt(form.get('stock') as string) || 0
		const tags = form.get('tags') as string

		if (!name || !slug || !price || !categoryId) {
			return fail(400, { error: 'Field wajib harus diisi' })
		}

		const product = await prisma.product.create({
			data: {
				name, slug, description, price,
				compareAtPrice: compareAtPrice || null,
				categoryId, stock, tags: tags || '',
				isActive: true
			}
		})

		const imageUrl = form.get('imageUrl') as string
		if (imageUrl) {
			await prisma.productImage.create({
				data: { url: imageUrl, alt: name, productId: product.id }
			})
		}

		throw redirect(302, '/admin/products')
	}
}
