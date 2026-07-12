// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null
			session: import('lucia').Session | null
			cartId: string
		}
		interface PageData {
			user: import('lucia').User | null
		}
	}
}

export {}
