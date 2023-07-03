<script lang="ts">
	import { currentNavLink } from '$lib/mylib/stores/navigation.store';
	import type { Link } from '$lib/mylib/types';
	import Icon from '../indicators/icon.svelte';
	import Loader from '../indicators/loader.svelte';

	export let link: Link;
	export let containerClass: string = '';
	export let disabled = false;

	let isLoading = false;

	const handleCLick = async () => {
		if (!link.click) return;
		isLoading = true;
		await link.click();
		isLoading = false;
	};
</script>

{#if link.disabled ?? disabled}
	<span
		class="d-flex flex-row gap-3 border-0 text-muted opacity-50 {containerClass} {link.classes}"
		title={link.tooltip}
	>
		{#if link.icon}
			<Icon icon={link.icon} />
		{/if}
		{#if link.title}
			{link.title}
		{/if}
	</span>
{:else}
	<a
		href={link.href ?? '#'}
		on:click={handleCLick}
		class="d-flex flex-row gap-2 border-0 {containerClass} {link.classes}"
		class:link-primary={link.isActive ? link.isActive($currentNavLink) : false}
		title={link.tooltip}
	>
		{#if isLoading}
			<Loader />
		{:else if link.icon}
			<Icon icon={link.icon} />
		{/if}
		{#if link.title}
			{link.title}
		{/if}
	</a>
{/if}
