<script lang="ts" context="module">
	export const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key: string, value: any) => {
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	};

	export const prettyPrintJSON = (obj: any) => {
		return JSON.stringify(obj, getCircularReplacer(), 2);
	};

	export const highlightJson = (json: string) => {
		return json
			.replace(/"(.*?)":/g, '<span class=json-key>$1</span>:')
			.replace(/(".*?")/g, '<span class=json-string>$1</span>')
			.replace(/(-?[\d.]+)(,?\n)/g, '<span class=json-number>$1</span>$2')
			.replace(/(true|false)(,?\n)/g, '<span class=json-boolean>$1</span>$2')
			.replace(/(null)(,?\n)/g, '<span class=json-null>$1</span>$2');
	};
</script>

<script lang="ts">
	export let data: any;
</script>

{#if data}
	{#if typeof data === 'string'}
		<pre class="json">{@html highlightJson(data)}</pre>
	{:else}
		<pre class="json">{@html highlightJson(prettyPrintJSON(data))}</pre>
	{/if}
{/if}

<style lang="scss">
	.json {
		background-color: #f5f5f5;
		border-radius: 5px;
		padding: 10px;
		font-family: monospace;
		font-size: 12px;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-all;

		:global(.json-key) {
			color: #5454ff;
		}

		:global(.json-string) {
			color: #ca1fca;
		}

		:global(.json-number) {
			color: #09861a;
			font-weight: bold;
		}

		:global(.json-boolean) {
			color: #cf5e1c;
			font-weight: bold;
		}

		:global(.json-null) {
			color: #cf1c1c;
		}
	}
</style>
