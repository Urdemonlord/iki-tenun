import { env } from '$env/dynamic/private'
import { createHash } from 'crypto'

const MIDTRANS_SERVER_KEY = env.MIDTRANS_SERVER_KEY || ''
const MIDTRANS_IS_PRODUCTION = env.MIDTRANS_IS_PRODUCTION || 'false'

const BASE_URL = MIDTRANS_IS_PRODUCTION === 'true'
	? 'https://app.midtrans.com/api/v2'
	: 'https://app.sandbox.midtrans.com/api/v2'

const SNAP_URL = MIDTRANS_IS_PRODUCTION === 'true'
	? 'https://app.midtrans.com/snap/snap.js'
	: 'https://app.sandbox.midtrans.com/snap/snap.js'

const AUTH_HEADER = 'Basic ' + Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')

export interface MidtransOrderItem {
	id: string
	name: string
	price: number
	quantity: number
}

export interface CreateTransactionParams {
	orderId: string
	amount: number
	items: MidtransOrderItem[]
	customer: {
		name: string
		phone: string
		email?: string
		address?: string
		city?: string
		postalCode?: string
	}
}

export interface CreateTransactionResult {
	token: string
	redirectUrl: string
}

/**
 * Create a Midtrans Snap transaction.
 * Returns snap token + redirect URL for the payment page.
 */
export async function createTransaction(
	params: CreateTransactionParams
): Promise<CreateTransactionResult> {
	if (!MIDTRANS_SERVER_KEY) {
		throw new Error('MIDTRANS_SERVER_KEY not configured')
	}

	const body = {
		transaction_details: {
			order_id: params.orderId,
			gross_amount: params.amount
		},
		item_details: params.items.map(i => ({
			id: i.id,
			name: i.name,
			price: i.price,
			quantity: i.quantity
		})),
		customer_details: {
			first_name: params.customer.name,
			phone: params.customer.phone,
			email: params.customer.email || undefined,
			shipping_address: params.customer.address
				? {
						address: params.customer.address,
						city: params.customer.city || undefined,
						postal_code: params.customer.postalCode || undefined
					}
				: undefined
		},
		enabled_payments: [
			'credit_card',
			'bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'permata_va',
			'other_va',
			'gopay', 'shopeepay', 'qris',
			'cstore', 'akulaku'
		]
	}

	const res = await fetch(`${BASE_URL}/${params.orderId}/charge`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: AUTH_HEADER
		},
		body: JSON.stringify(body)
	})

	const data = await res.json()

	if (data.status_code && data.status_code >= 400) {
		throw new Error(`Midtrans error: ${data.status_message || 'Unknown error'}`)
	}

	return {
		token: data.token,
		redirectUrl: data.redirect_url
	}
}

/**
 * Verify a Midtrans webhook notification signature.
 * Signature = SHA512(order_id + status_code + gross_amount + serverkey)
 */
export function verifySignature(
	orderId: string,
	statusCode: string,
	grossAmount: string,
	serverKey: string,
	signatureKey: string
): boolean {
	const input = orderId + statusCode + grossAmount + serverKey
	const expected = createHash('sha512').update(input).digest('hex')
	return expected === signatureKey
}

/**
 * Get transaction status from Midtrans API.
 */
export async function getTransactionStatus(orderId: string): Promise<{
	transaction_status: string
	fraud_status?: string
	payment_type?: string
}> {
	const res = await fetch(`${BASE_URL}/${orderId}/status`, {
		headers: { Authorization: AUTH_HEADER }
	})
	return res.json()
}

export { SNAP_URL }