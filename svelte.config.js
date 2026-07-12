/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		csrf: {
			checkOrigin: false
		}
	}
}

export default config
