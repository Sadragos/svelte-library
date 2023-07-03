import { writable } from "svelte/store";
import { getLocalStorageDefault } from "../utils/localStorageUtils";

export type Theme = 'light' | 'dark';

const current = getLocalStorageDefault('theme', 'light');
export const theme = writable<Theme>(current);

theme.subscribe(value => {
    localStorage.theme = value;
    const html = document.querySelector('html');
    if (html) html.setAttribute('data-bs-theme', value);
});