<script lang="ts">
	import { createEventDispatcher } from "svelte";


    export let currentPage: number;
    export let totalPages: number;
    export let maxItems: number = 7;

    let pages: (number | string)[] = [];

    const dispatch = createEventDispatcher();

    const gotoPage = (page: number) => {
        dispatch('pageChange', { page });
    };
    
    $: {
        pages = [];
        if (totalPages <= maxItems) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= maxItems - 2) {
                for (let i = 1; i <= maxItems - 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - maxItems + 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - maxItems + 2; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
    }
</script>

<ul class="pagination pagination m-2">
    <li class="page-item" class:disabled={currentPage === 1}>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="page-link" href="#" on:click={() => gotoPage(currentPage-1)}>
            <span class="material-symbols-outlined">chevron_left</span>
        </a>
    </li>
    {#each pages as page}
        <li class="page-item" class:active={page === currentPage}>
            {#if typeof page === 'string'}
                <span class="page-link">...</span>
            {:else}
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a class="page-link" href="#" on:click={() => gotoPage(Number(page))}>{page}</a>
            {/if}
        </li>
    {/each}
    <li class="page-item" class:disabled={currentPage >= totalPages}>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="page-link" href="#" on:click={() => gotoPage(currentPage+1)}>
            <span class="material-symbols-outlined">chevron_right</span>
        </a>
    </li>
</ul>