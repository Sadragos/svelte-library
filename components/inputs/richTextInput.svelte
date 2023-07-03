<script lang="ts">
	import type { Validator } from '$lib/mylib/components/inputs/basicInput.svelte';
	import { debounce } from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let value: string | undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = '';
	export let error: string | undefined = undefined;
	export let id: string = `text_${Math.random().toString(36).substring(2, 9)}`;
	export let debounceTime: number = 250;
	export let containerClass: string | undefined = undefined;
	export let validate: Validator<string> = () => undefined;
	export let height: string = 'auto';

	export function focus() {
		input.focus();
	}

	let input: HTMLTextAreaElement;

	const dispatch = createEventDispatcher();

	const onInput = debounce(async () => {
		error = await validate(internalValue);
		if (error) {
			return;
		}
		value = internalValue;
		dispatch('change', { value });
	}, debounceTime);

	$: internalValue = value;
</script>

<div class="form-floating {containerClass}">
	<textarea
		class="form-control"
		{id}
		{disabled}
		on:input={onInput}
		bind:this={input}
		bind:value={internalValue}
		placeholder={label}
		style="height: {height}"
	/>
	<label for={id}>{label}</label>
	{#if error}
		<span transition:fade class="text-danger small p-1">{@html error}</span>
	{/if}
</div>
