import { persisted } from "svelte-local-storage-store";
import { writable } from "svelte/store";
import type { CURRENCY_CODES } from "./currencyCodes";
import { SORT_BY, SORT_ORDER, THEMES } from "$lib/const";

export const openMenuDrawer = writable(false);

export const theme = persisted<THEMES>("theme", THEMES.dark);
export const sortBy = persisted<SORT_BY>("sort-by", SORT_BY.date);
export const sortOrder = persisted<SORT_ORDER>("sort-order", SORT_ORDER.asc);
export const defaultCurrency = persisted<CURRENCY_CODES>("default-currency", "JPY");
