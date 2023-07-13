import { persisted } from "svelte-local-storage-store";
import { writable } from "svelte/store";
import { THEMES } from "$lib/const";

export const openMenuDrawer = writable(false);

export const theme = persisted<THEMES>("theme", THEMES.system);
