<script lang="ts" context="module">
	export type InputOption<T = any> = { value: T; label?: string };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import BasicInput, { type Validator } from './basicInput.svelte';

	export let value: any;
	export let id: string = `select_${Math.random().toString(36).substring(2, 9)}`;
	export let label: string = '';
	export let disabled: boolean = false;
	export let containerClass: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let options: InputOption[];
	export let validate: Validator<InputOption> = () => undefined;

	export function focus() {
		input.focus();
	}

	let input: HTMLSelectElement;

	const dispatch = createEventDispatcher();

	const onInput = async (event: any) => {
		const selectedIndex = parseInt(event.target.value);
		const entry = options[selectedIndex];
		error = await validate(entry);
		if (error) {
			return;
		}
		value = entry?.value;
		dispatch('change', { value });
	};

	$: internalValue = options?.findIndex((o) => o.value === value);
</script>

<BasicInput {id} {error} {label} {containerClass}>
	<select
		{id}
		class="form-select"
		on:input={onInput}
		{disabled}
		bind:this={input}
		value={internalValue}
		placeholder={label}
	>
		{#each options || [] as option, i}
			<option value={i}>{option.label || option.value}</option>
		{/each}
	</select>
</BasicInput>
