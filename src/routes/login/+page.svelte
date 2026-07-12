<script lang="ts">
	import { enhance } from '$app/forms'
	let { form } = $props()
	let loading = $state(false)
</script>

<svelte:head>
	<title>Masuk - IKI TENUN</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md">
		<h1 class="font-display text-3xl font-bold text-center mb-2">IKI TENUN</h1>
		<p class="text-center text-stone mb-8">Masuk ke akun Anda</p>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance={() => {
			loading = true
			return async ({ update }) => { loading = false; await update() }
		}} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium mb-1">Email</label>
				<input type="email" id="email" name="email" required
					class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
			</div>
			<div>
				<label for="password" class="block text-sm font-medium mb-1">Password</label>
				<input type="password" id="password" name="password" required
					class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
			</div>
			<button type="submit" disabled={loading}
				class="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-stone transition disabled:opacity-50">
				{loading ? 'Masuk...' : 'Masuk'}
			</button>
		</form>

		<p class="text-center text-sm text-stone mt-6">
			Belum punya akun? <a href="/register" class="text-terracotta hover:underline">Daftar</a>
		</p>
	</div>
</main>
