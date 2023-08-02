import { isObject } from "./typeGuard";

export interface FrequencyV2 {
  year: number;
  month: number;
  day: number;
}

export interface ItemV2 {
  id: string;
  label: string;
  from: string;
  price: number;
  currency: string;
  start: string;
  frequency: FrequencyV2;
  note: string;
}

export const isItemV2 = (val: unknown): val is ItemV2 =>
  isObject<ItemV2>(val) &&
  typeof val.id === "string" &&
  typeof val.label === "string" &&
  typeof val.from === "string" &&
  typeof val.price === "number" &&
  typeof val.currency === "string" &&
  typeof val.start === "string" &&
  isObject<FrequencyV2>(val.frequency) &&
  typeof val.frequency.year === "number" &&
  typeof val.frequency.month === "number" &&
  typeof val.frequency.day === "number" &&
  typeof val.note === "string";
