import type { Prisma } from '@prisma/client'

export type Product = Prisma.ProductGetPayload<{
	include: { images: true; category: true }
}>
