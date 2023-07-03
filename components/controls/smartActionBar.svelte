<script lang="ts">
	import { t } from 'svelte-i18n';
	import SmartButton, { type ClickAction } from './smartButton.svelte';

	export let isNew: boolean = false;
	export let hideDelete: boolean = false;
	export let deleteClick: ClickAction = () => undefined;
	export let confirmDeleteText: string = $t('confirmDelete');
	export let saveClick: ClickAction;
</script>

<div class="input-group">
	{#if !isNew && !hideDelete}
		<SmartButton
			confirmClick
			buttonClass="btn-danger"
			icon="delete"
			onClick={deleteClick}
			dialogHeader={$t('confirmDelete')}
			dialogText={confirmDeleteText}
			confirmIcon="delete"
			confirmButtonClass="btn-danger"
		/>
	{/if}

	<SmartButton buttonClass="btn-success w-100" icon="save" onClick={saveClick} containerClass="flex-grow-1"/>
</div>
