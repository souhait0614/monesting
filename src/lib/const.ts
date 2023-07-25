import type { ItemData } from "../types/ItemData";

export const APP_NAME = "Monesting";
export const APP_DESCRIPTION = "サブスク管理アプリ";

export const ITEM_DATA_FILE_NAME = "items.json";
export const INITIAL_ITEM_DATA: ItemData = {
  formatVersion: 1,
  items: [],
};

export const QUERY_KEYS = {
  items: "items",
} as const;

export const THEMES = {
  system: "system",
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
