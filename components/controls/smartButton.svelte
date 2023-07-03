<script lang="ts" context="module">
	export type FlashIcon = {
		icon: string;
		iconClasses?: string;
		animationClass?: 'flashing' | 'rotating' | 'shaking' | string;
		timeout?: number;
	};

	export type ClickAction =
		| (() => void)
		| (() => Promise<void>)
		| (() => undefined | string)
		| (() => Promise<undefined | string>)
		| (() => undefined | FlashIcon)
		| (() => Promise<undefined | FlashIcon>)
		| (() => boolean)
		| (() => Promise<boolean>);
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import { writable } from 'svelte/store';
	import { Modal } from 'bootstrap';
	import { t } from 'svelte-i18n';
	import Loader from '../indicators/loader.svelte';
	import Icon from '../indicators/icon.svelte';

	export let containerClass: string | undefined = undefined;

	// Button Config
	export let buttonClass: string = 'btn-primary';
	export let icon: string | undefined = undefined;
	export let iconClass: string = '';
	export let text: string | undefined = undefined;
	export let disabled = false;
	export let confirmClick = false;
	export let id: string = `btn_${Math.random().toString(36).substring(2, 9)}`;
	export let onClick: ClickAction;

	// Dialog Config
	export let dialogId = `d${id}`;
	export let dialogIcon: string | undefined = 'help';
	export let dialogIconClass: string = '';
	export let dialogHeader: string | undefined = $t('confirm');
	export let dialogText: string | undefined = $t('areYouSure');
	export let cancelIcon: string = 'cancel';
	export let cancelText: string | undefined = undefined;
	export let cancelButtonClass: string = 'btn-secondary';
	export let confirmIcon: string | undefined = 'done';
	export let confirmText: string | undefined = undefined;
	export let confirmButtonClass: string = 'btn-primary';
	export let onCancel: ClickAction = () => undefined;

	const dispatch = createEventDispatcher();
	let isLoading = writable(false);
	let flashIcon = writable<FlashIcon | undefined>(undefined);
	let flashTimeout: any;
	let modal: any;

	isLoading.subscribe((nv) => dispatch('loading', nv));
	flashIcon.subscribe((nv) => {
		dispatch('flash', nv);
		if (nv) {
			flashTimeout = setTimeout(() => {
				$flashIcon = undefined;
				flashTimeout = undefined;
			}, nv.timeout || 3000);
		}
	});

	const handleClick = async (fromDialog = false) => {
		$isLoading = true;

		if (confirmClick && !fromDialog) {
			modal.show();
		} else {
			const response = await onClick();
			if (response !== undefined) {
				handleResponse(response);
			}
		}
		$isLoading = false;
	};

	const handleCancelClick = async () => {
		$isLoading = true;
		await onCancel();
		$isLoading = false;
	};

	const handleResponse = (response: string | boolean | FlashIcon) => {
		if (typeof response === 'string') {
			$flashIcon = {
				icon: response,
				animationClass: 'flashing'
			};
		} else if (typeof response === 'boolean') {
			$flashIcon = {
				icon: response ? 'done' : 'dangerous',
				animationClass: response ? 'flashing' : 'shaking',
				timeout: response ? 3000 : 1000
			};
		} else {
			$flashIcon = response;
		}
	};

	onMount(() => {
		if (confirmClick) {
			modal = new Modal(`#${dialogId}`);
		}
	});

	onDestroy(() => {
		if (flashTimeout) {
			clearTimeout(flashTimeout);
		}
	});
</script>

<div class="smart-button {containerClass}">
	<button
		disabled={disabled || $isLoading}
		{id}
		on:click={() => handleClick(false)}
		class="d-flex flex-row justify-content-center align-items-center gap-2 btn {buttonClass}"
	>
		{#if $isLoading}
			<Loader />
		{:else if $flashIcon}
			<Icon icon={$flashIcon.icon} extraClass="{$flashIcon.animationClass} {$flashIcon.iconClasses}" />
		{:else if icon}
			<Icon icon={icon} extraClass={iconClass} />
		{/if}
		{#if text}
			<span>{text}</span>
		{/if}
		<slot />
	</button>

	{#if confirmClick}
		<div class="modal fade" id={dialogId} tabindex="-1" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					{#if dialogHeader}
						<div class="modal-header">
							<h1 class="modal-title fs-5">{dialogHeader}</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
						</div>
					{/if}
					<div class="modal-body">
						<div class="d-flex flex-row gap-3 align-items-center">
							{#if dialogIcon}
								<Icon icon={dialogIcon} extraClass={dialogIconClass} />
							{/if}
							{#if dialogText}
								<span>{dialogText}</span>
							{/if}
						</div>
					</div>
					<div class="modal-footer">
						<button
							type="button"
							class="btn {cancelButtonClass} d-flex flex-row gap-2 align-items-center"
							data-bs-dismiss="modal"
							on:click={handleCancelClick}
						>
							{#if cancelIcon}
								<Icon icon={cancelIcon} />
							{/if}
							{#if cancelText}
								<span>{cancelText}</span>
							{/if}
						</button>

						<button
							type="button"
							class="btn {confirmButtonClass} d-flex flex-row gap-2 align-items-center"
							data-bs-dismiss="modal"
							on:click={() => handleClick(true)}
						>
							{#if confirmIcon}
								<Icon icon={confirmIcon} />
							{/if}
							{#if confirmText}
								<span>{confirmText}</span>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.smart-button button {
		min-height: 2.5rem;
	}
</style>