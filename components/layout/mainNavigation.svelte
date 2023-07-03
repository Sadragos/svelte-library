<script lang="ts">
	import type { Link } from '$lib/mylib/types';
	import {
		bottomMenuEntries,
		breadcrumbEntries,
		navButtons,
		navExpanded,
		topMenuEntries
	} from '$lib/mylib/stores/navigation.store';
	import { t } from 'svelte-i18n';
	import type { Readable, Writable } from 'svelte/store';
	import NavLink from './navLink.svelte';
	import Icon from '../indicators/icon.svelte';
	import { navigating } from '$app/stores';
	import { fly } from 'svelte/transition';

	export let topMenu: Readable<Link[]> = topMenuEntries;
	export let bottomMenu: Readable<Link[]> = bottomMenuEntries;
	export let breadcrumbs: Readable<Link[]> = breadcrumbEntries;
	export let nav: Readable<Link[]> = navButtons;
	export let expandedNav: Writable<boolean> = navExpanded;

	export let titleIcon: string = '';

	let container: HTMLDivElement;
	breadcrumbs.subscribe((entries) => {
		setTimeout(() => {
			if (!container) return;
			container.scrollLeft = container.scrollWidth;
		}, 250);
	});
</script>

<nav
	class="navbar navbar-expand-md flex-nowrap bg-primary text-bg-primary main-navbar"
	aria-label="Main navigation"
>
	{#if $topMenu.length > 0 || $bottomMenu.length > 0}
		<button
			class="navbar-toggler p-0 border-0 mx-2 text-bg-primary"
			type="button"
			aria-label="Toggle navigation"
			on:click={() => ($expandedNav = !$expandedNav)}
		>
			<Icon icon="menu" />
		</button>
	{/if}
	<div class="d-flex flex-row gap-2 align-items-center flex-grow-1 w-1">
		{#if titleIcon}
			<span class="material-symbols-outlined fs-1 ms-2 d-none d-md-block"> target </span>
		{/if}
		<div class="m-0 px-2 me-2 w-100">
			<div class="navbar-brand text-bg-primary m-0 p-0 d-flex flex-row align-items-center gap-2">
				<span class="d-none d-sm-inline">{$t('title')}</span>
				<span class=" d-sm-none">{$t('title_short')}</span>
			</div>
			{#if $breadcrumbs.length > 0}
				<div
					class="small opacity-75 overflow-auto text-nowrap w-100 d-flex flex-row gap-2 smooth-scroll"
					style="margin-top:-5px;"
					bind:this={container}
				>
					{#each $breadcrumbs as entry}
						<div class="d-inline-block text-truncate breadcrumb-link flex-shrink-0">
							{#if entry.href}
								<a
									href={entry.href}
									class="text-decoration-none text-bg-primary"
									on:click={() => ($expandedNav = false)}
								>
									{entry.title}
								</a>
							{:else}
								<span class="text-decoration-none text-bg-primary">{entry.title}</span>
							{/if}
						</div>
						{#if entry !== $breadcrumbs[$breadcrumbs.length - 1]}
							<span>&raquo;</span>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="">
		<ul class="navbar-nav me-auto gap-3 flex-row pe-2 pe-md-3 fs-4 animated">
			{#each $nav as entry}
				<li class="nav-item">
					<NavLink
						link={entry}
						disabled={$expandedNav}
						containerClass="list-group-item justify-content-center {entry.disabled
							? ''
							: 'list-group-item-action'}"
					/>
				</li>
			{/each}
		</ul>
	</div>
</nav>

{#if $navigating !== null}
	<div class="loader" transition:fly={{ y: -10, duration: 200 }}>
		<div class="progress">
			<div
				class="progress-bar progress-bar-striped progress-bar-animated"
				role="progressbar"
				style="width: 100%"
			/>
		</div>
	</div>
{/if}

<style lang="scss">
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
