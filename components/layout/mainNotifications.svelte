<script lang="ts">
	import { messages } from '@sadragos/svelte-tools/stores/notification.store';
	import { fade } from 'svelte/transition';
</script>

<div class="position-fixed" style="z-index: 10000; top: 8rem; right: 1rem; max-width: 400px;">
	<div class="d-flex flex-column align-items-end">
		{#each $messages as notification}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				transition:fade
				class="clickable alert alert-{notification.type || 'primary'} d-inline-block"
				role="alert"
				on:click={() => messages.remove(notification)}
			>
				<div class="d-flex flex-row flex-nowrap gap-3 align-items-center">
					{#if notification.icon}
						<span class="material-symbols-outlined">
							{notification.icon}
						</span>
					{/if}
					<div class="flex-grow-1 d-flex flex-column gap-1">
						<div class="d-flex flex-row justify-content-between">
							<span class="fw-bold">
								{#if notification.title}
									{notification.title}
								{/if}
							</span>
						</div>
						<span>{notification.message}</span>
						{#if notification.hint}
							<span class="small text-muted">{notification.hint}</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
