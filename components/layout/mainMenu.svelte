<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import NavLink from './navLink.svelte';
	import { bottomMenuEntries, navExpanded, topMenuEntries } from '../../stores/navigation.store';
	import { PUBLIC_BUILD_TIME } from '$env/static/public';
	import type { Link } from '../../types';

	export let expanded: Writable<boolean> = navExpanded;
	export let topMenu: Readable<Link[]> = topMenuEntries;
	export let bottomMenu: Readable<Link[]> = bottomMenuEntries;
	export let tinyText: string = `v ${PUBLIC_BUILD_TIME}`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="backdrop animated" class:open={$expanded} on:click={() => ($expanded = false)} />
<div
	class="menu bg-body border-end border-secondary border-opacity-50 d-flex flex-column flex-shrink-0 animated"
	class:open={$expanded}
>
	<div class=" flex-grow-1 overflow-auto">
		<div class="list-group rounded-0 border-0">
			{#each $topMenu as entry}
				{#if entry.href || entry.click}
					<NavLink
						link={entry}
						containerClass="list-group-item {entry.disabled ? '' : 'list-group-item-action'}"
					/>
				{:else if entry.children}
					<span class="fw-bold px-3 py-1 {entry.classes}">
						{entry.title}
					</span>
					<div>
						{#each entry.children as child}
							<NavLink
								link={child}
								containerClass="list-group-item {child.disabled ? '' : 'list-group-item-action'}"
							/>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="tiny text-muted ps-1">{tinyText}</div>
	<div class="list-group rounded-0 border-0 border-top">
		{#each $bottomMenu as entry}
			<NavLink
				link={entry}
				containerClass="list-group-item {entry.disabled ? '' : 'list-group-item-action'}"
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	@import 'bootstrap/scss/functions';
	@import 'bootstrap/scss/variables';
	@import 'bootstrap/scss/mixins';

	.backdrop {
		display: none;
		backdrop-filter: unset;
	}

	.menu {
		top: var(--header-height, 56px); /* Height of navbar */
		width: var(--menu-width, 12rem);
		align-items: unset;
	}

	.nav-item {
		min-width: 3rem;
	}

	@include media-breakpoint-down(md) {
		.menu {
			position: fixed;
			top: var(--header-height);
			left: 0;
			bottom: 0;
			z-index: 1000;
			transform: translateX(-100%);

			&.open {
				transform: translateX(0);
			}
		}

		.backdrop {
			display: block;
			position: fixed;
			left: 0;
			top: var(--header-height);
			right: 0;
			bottom: 0;
			z-index: 999;
			background: #00000000;
			pointer-events: none;

			&.open {
				background: #000000aa;
				pointer-events: all;
			}
		}
	}
</style>
