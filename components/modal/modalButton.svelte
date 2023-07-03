<script lang="ts">
	import Modal from "./modal.svelte";


	
	export let title: string | undefined = undefined;
	export let buttonClass: string = 'btn text-primary';
	export let icon: string | undefined = 'help';

	export let id: string = `help_${Math.random().toString(36).substring(2, 9)}`;


</script>

<button type="button" class="d-flex flex-row align-items-center {buttonClass}"  data-bs-toggle="modal" data-bs-target="#{id}">
    <span class="material-symbols-outlined">
        {icon}
    </span>
</button>
  

<Modal {id} {title}>
	<slot />
</Modal>
