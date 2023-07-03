<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Link } from '$lib/mylib/types';
	import SmartButton from '../controls/smartButton.svelte';

	export let link: Link;

	const handleCLick = async () => {
		if (link.click) {
			await link.click();
		}
		if (link.href) {
			goto(link.href, { replaceState: link.replaceState || false });
		}
		return true;
	};
</script>

<SmartButton buttonClass={link.classes} icon={link.icon} onClick={handleCLick} />
