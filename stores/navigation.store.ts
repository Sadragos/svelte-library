import { page } from "$app/stores";
import { mainMapVisibility } from "$lib/map/mapUtils";
import type { Link } from "$lib/mylib/types";
import { derived, get, writable } from "svelte/store";


export const navExpanded = writable(false);
export const currentNavLink = derived(page, $page => {
    return String($page.url).replace(window.location.origin, '');
});

export const topMenuEntries = writable<Link[]>([]);
export const bottomMenuEntries = writable<Link[]>([]);
export const breadcrumbEntries = writable<Link[]>([]);
export const navButtons = writable<Link[]>([]);
