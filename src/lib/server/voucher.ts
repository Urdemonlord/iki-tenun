/**
 * Simple voucher system for MVP.
 * Hardcoded codes with fixed discount percentages.
 */

interface VoucherCode {
	code: string
	discountPercent: number
	description: string
	minPurchase?: number
	active: boolean
}

const VOUCHERS: VoucherCode[] = [
	{ code: 'WELCOME10', discountPercent: 10, description: 'Diskon 10%', active: true },
	{ code: 'IKITENUN20', discountPercent: 20, description: 'Diskon 20%', minPurchase: 500000, active: true },
	{ code: 'FREESHIP', discountPercent: 0, description: 'Gratis Ongkir', active: true },
	{ code: 'HEMAT5', discountPercent: 5, description: 'Diskon 5%', active: true }
]

export interface VoucherResult {
	valid: boolean
	code: string
	discountPercent: number
	description: string
	discountAmount: number
}

/**
 * Validate a voucher code and calculate discount.
 * Returns null if code is invalid.
 */
export function validateVoucher(code: string, subtotal: number): VoucherResult | null {
	const normalized = code.trim().toUpperCase()
	const voucher = VOUCHERS.find(v => v.code === normalized && v.active)

	if (!voucher) return null

	if (voucher.minPurchase && subtotal < voucher.minPurchase) {
		return null
	}

	const discountAmount = Math.round(subtotal * voucher.discountPercent / 100)

	return {
		valid: true,
		code: voucher.code,
		discountPercent: voucher.discountPercent,
		description: voucher.description,
		discountAmount
	}
}
