<script lang="ts">
	let { page, totalPages, basePath = '/products', params = {} }: {
		page: number; totalPages: number; basePath?: string; params?: Record<string, string>;
	} = $props();

	function buildUrl(p: number) {
		const s = new URLSearchParams(params);
		s.set('page', String(p));
		return `${basePath}?${s.toString()}`;
	}

	let pages = $derived((() => {
		const arr: (number | '...')[] = [];
		if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) arr.push(i); }
		else {
			arr.push(1);
			if (page > 3) arr.push('...');
			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);
			for (let i = start; i <= end; i++) arr.push(i);
			if (page < totalPages - 2) arr.push('...');
			arr.push(totalPages);
		}
		return arr;
	})());
</script>

{#if totalPages > 1}
<nav class="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
	<a href={buildUrl(page - 1)}
			class="px-4 py-2 text-sm rounded transition
				{page <= 1 ? 'pointer-events-none text-sand' : 'text-stone hover:bg-sand/30 hover:text-charcoal active:bg-sand/40'}">
			← Sebelumnya
		</a>
		{#each pages as p}
			{#if p === '...'}
				<span class="px-2 py-2 text-sm text-sand">…</span>
			{:else}
				<a href={buildUrl(p)}
					class="px-3 py-2 text-sm rounded transition min-w-[2.25rem] text-center
						{p === page ? 'bg-charcoal text-white font-medium' : 'text-stone hover:bg-sand/30 hover:text-charcoal active:bg-sand/40'}">
					{p}
				</a>
			{/if}
		{/each}
		<a href={buildUrl(page + 1)}
			class="px-4 py-2 text-sm rounded transition
				{page >= totalPages ? 'pointer-events-none text-sand' : 'text-stone hover:bg-sand/30 hover:text-charcoal active:bg-sand/40'}">
			Selanjutnya →
	</a>
</nav>
{/if}
