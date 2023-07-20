<script lang="ts">
	import { debounce } from 'lodash';
	import type { MomentInput } from 'moment';
	import moment from 'moment';
	import { createEventDispatcher } from 'svelte';
	import BasicInput, { type Validator } from './basicInput.svelte';
	import { PB_DATE_FORMAT } from '@sadragos/svelte-tools';

	export let value: MomentInput | undefined;
    export let disabled: boolean = false;
    export let label: string | undefined = '';
    export let error: string | undefined = undefined;
    export let id: string = `date_${Math.random().toString(36).substring(2, 9)}`;
    export let debounceTime: number = 250;
    export let containerClass: string | undefined = undefined;
    export let validate: Validator<moment.Moment> = () => undefined;

    let input: HTMLInputElement;

    const dispatch = createEventDispatcher();

    const onInput = debounce(async () => {
        const newValue = internalValue ? moment(internalValue).utc(false) : undefined;
        error = await validate(newValue);
        if(error) { return; }
        value = newValue ? newValue.toISOString() : undefined;
        dispatch('change', { value });
    }, debounceTime);

    $: internalValue = value ? moment(value).utc(true).format(PB_DATE_FORMAT) : undefined;

</script>

<BasicInput {label} {error} {id} {containerClass}>
	<input
		class="form-control  {error ? 'border-danger' : ''}"
		{id}
		type="date"
		on:input={onInput}
		{disabled}
		bind:this={input}
		bind:value={internalValue}
        placeholder="{label}"
	/>
</BasicInput>
