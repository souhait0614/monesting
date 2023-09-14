import type { ItemData, ItemDataV3 } from "../types/ItemData";
import type { NotificationData } from "../types/NotificationData";

export const APP_NAME = "Monesting";
export const APP_DESCRIPTION = "サブスク管理アプリ";

export const USING_ITEM_DATA_FORMAT_VERSION = 3 satisfies ItemData["formatVersion"];
export const ITEM_DATA_FILE_NAME = "items.json";
export const INITIAL_ITEM_DATA: ItemDataV3 = {
  formatVersion: USING_ITEM_DATA_FORMAT_VERSION,
  items: [],
};

export const USING_NOTIFICATION_DATA_FORMAT_VERSION = 1 satisfies NotificationData["formatVersion"];

export const QUERY_KEYS = {
  itemData: "itemData",
  notificationData: "notificationData",
} as const;

export const MUTATION_KEYS = {
  itemData: "itemData",
  notificationData: "notificationData",
} as const;

export const THEMES = {
  // system: "system",
  light: "light",
  dark: "dark",
} as const;

export type THEMES = keyof typeof THEMES;

export const SORT_BY = {
  date: "date",
  name: "name",
} as const;

export type SORT_BY = keyof typeof SORT_BY;

export const SORT_ORDER = {
  asc: "asc",
  desc: "desc",
} as const;

export type SORT_ORDER = keyof typeof SORT_ORDER;
