<script lang="ts">
	export let icon: string;
	export let type: 'outlined' | 'rounded' | 'sharp' = 'outlined';
    export let extraClass: string = '';
</script>

<span class="material-symbols-{type} {extraClass}">{icon}</span>
