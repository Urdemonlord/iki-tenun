export interface Product {
	id: string; name: string; slug: string; price: number;
	compareAtPrice: number | null; images: { url: string; alt: string | null }[];
	category?: { name: string; slug: string };
	stock?: number; tags?: string;
	isNewArrival?: boolean; isFeatured?: boolean;
}
