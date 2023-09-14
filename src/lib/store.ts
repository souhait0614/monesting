import { persisted } from "svelte-local-storage-store";
import { writable } from "svelte/store";
import type { LoadingNotificationPermission } from "../types/Util";
import type { NotificationV1 } from "../types/NotificationV1";
import type { CURRENCY_CODES } from "./currencyCodes";
import { SORT_BY, SORT_ORDER, THEMES } from "$lib/const";

export const isWideLayout = writable(false);
export const openMenuDrawer = writable(false);
export const openAddItemModal = writable(false);
export const notificationPermission = writable<LoadingNotificationPermission>("loading");
export const notificationNotUpdated = writable(false);
export const remoteNotifications = writable<NotificationV1[]>([]);

export const theme = persisted<THEMES>("theme", THEMES.dark);
export const sortBy = persisted<SORT_BY>("sort-by", SORT_BY.date);
export const sortOrder = persisted<SORT_ORDER>("sort-order", SORT_ORDER.asc);
export const defaultCurrency = persisted<CURRENCY_CODES>("default-currency", "JPY");
