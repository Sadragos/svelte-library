<script lang="ts">
	import { Modal } from 'bootstrap';
	import { onMount } from 'svelte';

	export let id: string = `modal_${Math.random().toString(36).substring(2, 9)}`;
	export let title: string | undefined = undefined;
	export let visible: boolean = false;

	let modal: any;

	onMount(() => {
		modal = new Modal(`#${id}`);
	});

	$: if (modal) {
		if (visible) {
			modal.show();
		} else {
			modal.hide();
		}
	}
</script>

<div class="modal fade" {id} tabindex="-1" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			{#if title}
				<div class="modal-header">
					<h1 class="modal-title fs-5">{title}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
			{/if}
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
                <slot name="footer" >
				    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                </slot>
			</div>
		</div>
	</div>
</div>
