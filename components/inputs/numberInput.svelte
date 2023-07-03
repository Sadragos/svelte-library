<script lang="ts">
	import { debounce } from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import BasicInput, { type Validator } from './basicInput.svelte';

	export let value: number | undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = '';
	export let error: string | undefined = undefined;
	export let id: string = `number_${Math.random().toString(36).substring(2, 9)}`;
	export let debounceTime: number = 250;
	export let containerClass: string | undefined = undefined;
	export let validate: Validator<number> = () => undefined;
	export let step: number = 0.01;

	export function focus() {
		input.focus();
		input.select();
	}

	let input: HTMLInputElement;

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

<BasicInput {label} {error} {id} {containerClass}>
	<input
		class="form-control {error ? 'border-danger' : ''}"
		{id}
		type="number"
		{step}
		on:input={onInput}
		{disabled}
		bind:this={input}
		bind:value={internalValue}
		placeholder="{label}"
	/>
</BasicInput>
