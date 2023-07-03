<script lang="ts">
	import { debounce } from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import BasicInput, { type Validator } from './basicInput.svelte';

	export let value: string | undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = '';
	export let error: string | undefined = undefined;
	export let id: string = `color_${Math.random().toString(36).substring(2, 9)}`;
	export let containerClass: string | undefined = undefined;
	export let validate: Validator<string> = () => undefined;
	export let debounceTime = 500;

	export function focus() {
		input.focus();
		input.select();
	}

	let input: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const onInput = debounce(async () => {
		error = await validate(internalValue);
		value = internalValue;
		dispatch('change', { value });
		console.log(internalValue);
	}, debounceTime);

	$: internalValue = value;
</script>

<BasicInput {label} {error} {id} {containerClass}>
	<input
		class="form-control {error ? 'border-danger' : ''}"
		{id}
		type="color"
		on:input={onInput}
		{disabled}
		bind:this={input}
		bind:value={internalValue}
		placeholder={label}
	/>
</BasicInput>

<style lang="scss">
	input[type='color'] {
		padding: 0 !important;
		overflow: hidden;
	}
</style>
