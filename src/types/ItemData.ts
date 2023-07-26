import { isObject } from "./typeGuard";

export interface Frequency {
  year: number;
  month: number;
  day: number;
}

export interface Item {
  id: string;
  label: string;
  from: string;
  price: number;
  currency: string;
  start: Date;
  frequency: Frequency;
}

export const isItem = (val: unknown): val is Item => isObject<Item>(val);

export interface ItemData {
  formatVersion: 1;
  items: Item[];
}

export const isItemData = (val: unknown): val is ItemData => isObject<ItemData>(val) && Array.isArray(val.items);
