<script lang="ts">
	import type { BaseSystemFields } from '$lib/pocketbase/generated-types';
	import { pb } from '$lib/stores/pb.store';
	import type { FileInputValue } from '$lib/types';
	import _ from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import Loader from '../../../components/loader.svelte';
	import { compressAndResizeImage } from '$lib/mylib/utils/imageUtils';

	export let value: FileInputValue;
	export let disabled: boolean = false;
	export let label: string | undefined = '';
	export let error: string | undefined = undefined;
	export let id: string = `image_${Math.random().toString(36).substring(2, 9)}`;
	export let maxFiles: number = 1;
	export let record: Pick<BaseSystemFields, 'id' | 'collectionId' | 'collectionName'>;
	export let containerClass: string | undefined = undefined;
	export let fileNameLength = 100;

	export function clickOnInput() {
		const input = document.getElementById(id);
		if (input) {
			input.click();
		}
	}
	let processingFiles = false;

	const dispatch = createEventDispatcher();

	const onInput = async () => {
		if (maxFiles === 1) {
			value = internalValue.length > 0 ? internalValue[0] : undefined;
		} else {
			value = [...internalValue, ...deletedFiles.map((f) => `${f}-`)];
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
			return await compressAndResizeImage(renamedFile);
		} else {
			return await compressAndResizeImage(file);
		}
	};

	const onFileSelect = async (event: any) => {
		processingFiles = true;
		const fileList = event.target.files;
		if (!fileList || fileList.length === 0) return;
		for (const file of fileList) {
			internalValue = [...internalValue, await prepareImage(file)];
			dispatch('fileAdded', { file });
		}
		processingFiles = false;
		onInput();
	};

	const removeFile = (file: string | File) => {
		if (deletedFiles && typeof file === 'string') {
			deletedFiles.push(file);
			dispatch('existingFileDeleted', { file });
		}
		dispatch('fileDeleted', { file });
		internalValue = internalValue.filter((v: string | File) => v !== file);
		onInput();
	};

	const onFileUpload = async (url: string) => {
		processingFiles = true;
		const image = await fetch(url);
		const imageBlob = await image.blob();
		const file = new File([imageBlob], decodeURI(url.split('/').pop() || 'image.jpg'), {
			type: imageBlob.type
		});
		internalValue = [...internalValue, await prepareImage(file)];
		processingFiles = false;
	};

	const uploadCloud = async () => {
		const url = prompt($t('upload_new_image_from_cloud'));
		if (url) await onFileUpload(url);
	};

	$: internalArray = !value ? [] : Array.isArray(value) ? value : [value];
	$: internalValue = internalArray.filter(
		(v) => v instanceof File || (typeof v === 'string' && !v.endsWith('-'))
	);
	$: deletedFiles = internalArray
		.filter((v) => typeof v === 'string' && v.endsWith('-'))
		.map((f: string | File) => _.trimEnd(f as string, '-'));
</script>

<div class="form-floating-custom {containerClass}">
	<input class="d-none" {id} type="file" on:change={onFileSelect} {disabled} />
	<div
		class="border border-1 border-secodary rounded bg-body d-flex flex-column flex-nowrap overflow-auto"
	>
		<div class="d-flex flex-row gap-2 align-items-center p-1 border-bottom text-muted small">
			<i class="bi bi-image ms-2" />
			<span>{label}</span>
		</div>
		{#each internalValue as img}
			<div
				class="border-bottom d-flex flex-row flex-nowrap gap-1 align-items-center image-input-preview"
			>
				{#if record !== undefined && typeof img === 'string'}
					<a class="btn p-0" href={$pb.getFileUrl(record, img)} target="_blank" rel="noreferrer">
						<img
							class="tiny-image rounded-1"
							src={$pb.getFileUrl(record, img, { thumb: '100x100' })}
							alt={img}
						/>
					</a>
					<span class="text-secondary flex-grow-1 overflow-hidden text-nowrap">{img}</span>
					<button class="btn text-danger" on:click={() => removeFile(img)}
						><i class="bi bi-trash" /></button
					>
				{:else if img instanceof File}
					<a class="btn p-0" href={URL.createObjectURL(img)} target="_blank" rel="noreferrer">
						<img class="tiny-image rounded-1" src={URL.createObjectURL(img)} alt={img.name} />
					</a>
					<span class="text-secondary flex-grow-1 overflow-hidden text-nowrap">* {img.name}</span>
					<button class="btn text-danger" on:click={() => removeFile(img)}>
						<i class="bi bi-trash" />
					</button>
				{/if}
			</div>
		{/each}
		{#if maxFiles > 0 && internalValue.length < maxFiles && !processingFiles}
			<div class="btn-group btn-group-sm">
				<button
					class="btn btn-sm flex-grow-1 d-flex flex-row align-items-center gap-2 justify-content-center"
					on:click={() => clickOnInput()}
				>
					<i class="bi bi-upload" />{$t('upload_new_image')}
				</button>
				<!-- <button
				class="btn btn-sm flex-grow-1 d-flex flex-row align-items-center gap-2 justify-content-center"
				on:click={uploadCloud}
			>
				<i class="bi bi-cloud-arrow-up" />{$t('upload_new_image_from_cloud')}
			</button> -->
			</div>
		{/if}
		{#if processingFiles}
			<div class="p-1">
				<Loader description={$t('processing_files')} type="small" center />
			</div>
		{/if}
	</div>
	{#if error}
		<span transition:fade class="text-danger small p-1">{@html error}</span>
	{/if}
</div>

<style lang="scss">
	.tiny-image {
		width: 40px;
		height: 40px;
		object-fit: cover;
	}

	.image-input-preview:last-child {
		border-bottom: unset !important;
	}
</style>
