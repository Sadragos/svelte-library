<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Link } from '$lib/mylib/types';

	export let action: Link;

	let expand = false;

	const clickButton = (button: Link) => {
		if (button.click) {
			button.click();
		} else if (button.href) {
			goto(button.href);
		}
	};

	const clickPrimary = () => {
		if (action.children?.length) {
			expand = !expand;
		} else {
			clickButton(action);
		}
	};
</script>

<div class="sticky-bottom m-2 float-end">
	<button
		class="position-relative btn d-flex flex-column justify-content-center align-items-center {action.classes ||
			'btn-primary'}"
		on:click={clickPrimary}
	>
		<span class="material-symbols-outlined">{expand ? 'close' : action.icon || 'check'}</span>
	</button>
	{#if action.children}
		<div class="position-absolute submenu d-flex flex-column gap-2 {expand ? '' : 'hidden'}">
			{#each action.children as act}
				<div class="d-flex flex-row gap-2 align-items-center">
					<span class="bg-dark text-bg-dark px-2 shadow rounded-pill">{act.title}</span>
					<button
						class="btn btn-secondary d-flex flex-column justify-content-center align-items-center {act?.classes ||
							'btn-secondary'}"
						on:click={() => clickButton(act)}
					>
						<span class="material-symbols-outlined">{act.icon}</span>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.btn {
		border-radius: 50%;
		height: 3.5em;
		width: 3.5em;
		box-shadow: 1px 2px 0.5em rgba(0, 0, 0, 0.5);
		z-index: 2;

		> span {
			transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
		}
	}

	.submenu {
		right: 0.5em;
		bottom: 4em;
		z-index: 1;

		.btn {
			height: 2.5em;
			width: 2.5em;
			z-index: 1;
		}

		& > div {
			margin-bottom: 0;
			transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 1;

			&:nth-child(2) {
				bottom: 3em;
			}

			&:nth-child(3) {
				bottom: 6em;
			}

			&:nth-child(4) {
				bottom: 9em;
			}

			&:nth-child(5) {
				bottom: 12em;
			}

			&:nth-child(6) {
				bottom: 15em;
			}

			> span {
				opacity: 1;
				transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
			}
		}

		&.hidden {
			> div {
				bottom: -3.5em;

				> span {
					opacity: 0;
					pointer-events: none;
				}
			}
		}
	}
</style>
