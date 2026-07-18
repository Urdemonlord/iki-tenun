import { prisma } from '$lib/server/db'
import type { RequestHandler } from './$types'

const BASE_URL = 'https://ikitenun.meowlabs.id'

/**
 * Generate dynamic sitemap.xml with all products, categories, and static pages.
 */
export const GET: RequestHandler = async () => {
	const [products, categories] = await Promise.all([
		prisma.product.findMany({
			where: { isActive: true },
			select: { slug: true, updatedAt: true }
		}),
		prisma.category.findMany({ select: { slug: true } })
	])

	const urls = [
		{ loc: '', changefreq: 'daily', priority: '1.0' },
		{ loc: '/products', changefreq: 'daily', priority: '0.9' },
		{ loc: '/about', changefreq: 'monthly', priority: '0.6' },
		{ loc: '/contact', changefreq: 'monthly', priority: '0.5' },
		...categories.map(c => ({
			loc: `/products?category=${c.slug}`,
			changefreq: 'weekly' as const,
			priority: '0.8'
		})),
		...products.map(p => ({
			loc: `/products/${p.slug}`,
			changefreq: 'weekly' as const,
			priority: '0.8',
			lastmod: p.updatedAt.toISOString().split('T')[0]
		}))
	]

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}  </url>`).join('\n')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	})
}
