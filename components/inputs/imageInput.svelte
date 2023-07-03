<script lang="ts">
	import { DbStatus, type ImageField } from '$lib/mylib/data/MyDB';
	import { compressAndResizeImage, getLocationFromImage } from '$lib/mylib/utils/imageUtils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	

	export let value: File | undefined = undefined;
	export let disabled: boolean = false;
	export let error: string | undefined = undefined;
	export let id: string = `image_${Math.random().toString(36).substring(2, 9)}`;
	export let containerClass: string | undefined = undefined;
	export let fileNameLength = 100;
	export let maxImageSize = 1200;
	export let imageQuality = 70;
	export let height = 'calc(3.5rem + calc(var(--bs-border-width) * 2))';
	export let heightWithValue = '12rem';
	export let width = 'auto';
	export let fit: 'cover' | 'contain' | 'fill' = 'cover';
	export let label: string | undefined = undefined;
	export let loadPositionFromExif: boolean = false;

	export let record: any = undefined;
	export let imageField: string | undefined = undefined;

	export function clickOnInput(capture: boolean) {
		const input = document.getElementById(id);
		if (input) {
			if(capture) input.setAttribute('capture', 'environment');
			else input.removeAttribute('capture');
			setTimeout(() => input.click(), 0);
		}
	}
	let internalValue: File | undefined;
	let processingFiles = false;
	let showOverlay = false;

	const dispatch = createEventDispatcher();

	const onInput = async () => {
		value = internalValue;
		if(record && imageField) {
			record[imageField] = {
				bin: value,
				status: DbStatus.UPDATED
			} as ImageField;
		}
		dispatch('change', { value });
	};

	const prepareImage = async (file: File) => {
		if (file.name.length > fileNameLength) {
			const ext = file.name.split('.').pop() || '';
			const renamedFile = new File(
				[file],
				file.name.substring(0, fileNameLength - ext.length - 1) + '.' + ext,
				{ type: file.type }
			);
			return await compressAndResizeImage(renamedFile, maxImageSize, maxImageSize, imageQuality);
		} else {
			return await compressAndResizeImage(file, maxImageSize, maxImageSize, imageQuality);
		}
	};

	const onFileSelect = async (event: any) => {
		showOverlay = false;
		processingFiles = true;
		const fileList= event.target.files;
		if (!fileList || fileList.length === 0) return;
		for (const file of fileList) {
			internalValue = await prepareImage(file);
			dispatch('fileAdded', { file });
			if(loadPositionFromExif) {
				const position = await getLocationFromImage(file);
				if(position) {
					dispatch('locationFound', { position });
				}
			}
		}
		processingFiles = false;
		onInput();
	};

	const removeFile = () => {
		internalValue = undefined;
		dispatch('fileDeleted');
		onInput();
	};

	const showImage = async () => {
		// TODO
		alert('Noch nicht implementiert');
	};

	const clickImage = () => {
		showOverlay = !showOverlay;
	};

	onMount(() => {
		if(record && imageField && !value) {
			const image = record[imageField] as ImageField;
			if(image && image.bin) {
				value = image.bin;
			}
		}
	});

	$: labelClasses = value ? 'position-absolute bg-body bg-opacity-75 m-1 ms-2 small px-1 rounded text-muted' : 'ms-2 p-1 pt-2 mt-2 d-block'
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
	role="button"
	class="rounded border overflow-hidden position-relative bg-body {containerClass}"
	style="width: {width}; height: {value ? heightWithValue : height};"
	on:click={clickImage}
>
	{#if showOverlay}
		<div
			class="position-absolute bg-secondary bg-opacity-75 w-100 h-100 flex-row justify-content-center align-items-center d-flex"
			transition:fade
			style="z-index: 100"
		>
			<div class="d-flex flex-row gap-2 p-2 rounded shadow bg-secondary">
				{#if value}
					<button class="btn btn-primary d-flex" type="button" on:click={showImage} {disabled}>
						<span class="material-symbols-outlined">visibility</span>
					</button>
				{/if}
				<button class="btn btn-primary d-flex" type="button" on:click={() => clickOnInput(false)} {disabled}>
					<span class="material-symbols-outlined">upload_file</span>
				</button>
				<button class="btn btn-primary d-flex" type="button" on:click={() => clickOnInput(true)} {disabled}>
					<span class="material-symbols-outlined">add_a_photo</span>
				</button>
				{#if value}
					<button class="btn btn-danger d-flex" type="button" on:click={removeFile} {disabled}>
						<span class="material-symbols-outlined">delete</span>
					</button>
				{/if}
			</div>
		</div>
	{/if}
	<input class="d-none" {id} type="file" accept="image/*" on:change={onFileSelect} {disabled} />
	{#if label}
	<span class={labelClasses}>
		{label}
	</span>
	{/if}
	<div class="h-100 d-flex flex-column justify-content-center">
		{#if processingFiles}
			<div
				class="bg-secondary-subtle d-flex flex-row justify-content-center align-items-center border-1 border-secondary h-100"
			>
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		{:else if value}
			<div
				class="d-flex flex-row justify-content-center align-items-center border-1 border-secondary clickable bg-primary-subtle h-100"
				aria-expanded="false"
			>
				<img
					class="tiny-image rounded-1"
					style="object-fit: {fit};"
					src={URL.createObjectURL(value)}
					alt="uploaded"
				/>
			</div>
		{/if}
	</div>
	{#if error}
		<span transition:fade class="text-danger small p-1">{@html error}</span>
	{/if}
</div>

<style lang="scss">
	.tiny-image {
		width: 100%;
		height: 100%;
	}
</style>
