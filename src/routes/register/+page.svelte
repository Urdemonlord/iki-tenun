<script lang="ts">
	import { enhance } from '$app/forms'
	let { form } = $props()
	let loading = $state(false)
</script>

<svelte:head>
	<title>Daftar - IKI TENUN</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md">
		<h1 class="font-display text-3xl font-bold text-center mb-2">IKI TENUN</h1>
		<p class="text-center text-stone mb-8">Buat akun baru</p>

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
				<label for="name" class="block text-sm font-medium mb-1">Nama Lengkap</label>
				<input type="text" id="name" name="name" required minlength="2"
					class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
			</div>
			<div>
				<label for="email" class="block text-sm font-medium mb-1">Email</label>
				<input type="email" id="email" name="email" required
					class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
			</div>
			<div>
				<label for="password" class="block text-sm font-medium mb-1">Password</label>
				<input type="password" id="password" name="password" required minlength="6"
					class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
			</div>
			<button type="submit" disabled={loading}
				class="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-stone transition disabled:opacity-50">
				{loading ? 'Mendaftar...' : 'Daftar'}
			</button>
		</form>

		<p class="text-center text-sm text-stone mt-6">
			Sudah punya akun? <a href="/login" class="text-terracotta hover:underline">Masuk</a>
		</p>
	</div>
</main>
