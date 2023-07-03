<script lang="ts">
	import { fade } from "svelte/transition";

    export let error: string | undefined = undefined;
    export let label: string | undefined = '';
    export let id: string = `switch_${Math.random().toString(36).substring(2, 9)}`;
    export let loading: boolean = false;
    export let containerClass: string | undefined = undefined;
    export let value: boolean | undefined;

</script>

<div class="form-check form-switch {containerClass}">
    <input class="form-check-input" type="checkbox" role="switch" {id} bind:checked={value}>
    {#if loading}
    <div transition:fade class="position-absolute top-0 end-0 h-100 p-2 pt-1">
        <div  class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    {/if}
	<label for={id} class={error ? 'text-danger' : ''}>{label}</label>
	{#if error}
		<span transition:fade class="text-danger small p-1">{@html error}</span>
	{/if}
</div>