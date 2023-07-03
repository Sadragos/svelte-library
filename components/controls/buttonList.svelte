<script lang="ts">
	import NavButton from '$lib/components/navButton.svelte';
	import type { Link } from '$lib/mylib/types';

	export let buttons: Link[] = [];
	export let animated = true;
	export let classes = 'bg-body-secondary';

	$: visibleButton = buttons.filter((b) => !b.hidden);
	$: leftButtons = visibleButton.filter((b) => b.position === 'left');
	$: rightButtons = visibleButton.filter((b) => b.position === 'right');
	$: centerButtons = visibleButton.filter((b) => b.position === 'center' || !b.position);
	$: hidden = visibleButton.length === 0;
</script>

<div class="buttonbar overflow-hidden {classes}" class:animated class:hidden>
	<div class="d-flex flex-row flex-wrap w-100 align-content-center h-100 gap-1 px-1">
		<div>
			{#each leftButtons as button}
				<NavButton link={button} />
			{/each}
		</div>
		<div class="flex-grow-1 d-flex flex-row justify-content-center">
			{#each centerButtons as button}
				<NavButton link={button} />
			{/each}
		</div>
		{#each rightButtons as button}
			<NavButton link={button} />
		{/each}
	</div>
</div>

<style lang="scss">
	.buttonbar {
		& > div {
			min-height: 3rem;
		}

		&.hidden {
			& > div {
				min-height: 0;
			}

			overflow: hidden;
		}
	}
</style>
