<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentNavLink } from '$lib/mylib/stores/navigation.store';
	import type { Link } from '$lib/mylib/types';

	export let buttons: Link[];
	export let secondary = false;

	const click = (button: Link) => {
		if (button.click) button.click();
		else if (button.href) goto(button.href, { replaceState: true });
	};

</script>

<nav>
	<div
		class="nav nav-tabs pt-2 ps-1 card-header pb-0 overflow-auto overflow-y-hidden d-flex flex-nowrap"
		role="tablist"
		id={secondary ? 'secondaryTabs' : 'primaryTabs' }
		class:pb-2={secondary}
		class:gap-2={secondary}
		class:bg-primary-subtle={!secondary}
		
	>
		{#each buttons as button}
			<button
				class="nav-link"
				class:active={button.isActive ? button.isActive($currentNavLink) : false}
				class:rounded-pill={secondary}
				class:bg-primary={secondary}
				class:text-bg-primary={secondary}
				class:p-1={secondary}
				class:px-2={secondary}
				class:small={secondary}
				type="button"
				role="tab"
				disabled={button.disabled}
				on:click={() => click(button)}
			>
				{button.title}
			</button>
		{/each}
	</div>
</nav>
