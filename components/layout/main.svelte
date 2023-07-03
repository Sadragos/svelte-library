<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isLoading } from 'svelte-i18n';
	import Loader from '../indicators/loader.svelte';

	const dispatch = createEventDispatcher();

	$: if (!$isLoading) dispatch('languageLoaded', true);
</script>


{#if $isLoading}
	<Loader />
{:else}
	hallo
{/if}

<style lang="scss">
	@import 'bootstrap/scss/functions';
	@import 'bootstrap/scss/variables';
	@import 'bootstrap/scss/mixins';

	.main-container {
		margin-top: var(--header-height);
		height: calc(100svh - var(--header-height));
	}

	.loader {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10000;
		.progress {
			border-radius: unset;
			height: 5px;
		}
	}
</style>
