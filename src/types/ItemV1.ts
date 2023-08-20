import { isObject } from "./typeGuard";

export interface FrequencyV1 {
  year: number;
  month: number;
  day: number;
}

export const isFrequencyV1 = (val: unknown): val is FrequencyV1 =>
  isObject<FrequencyV1>(val) &&
  typeof val.year === "number" &&
  typeof val.month === "number" &&
  typeof val.day === "number";

export interface ItemV1 {
  id: string;
  label: string;
  from: string;
  price: number;
  currency: string;
  start: string;
  frequency: FrequencyV1;
}

export const isItemV1 = (val: unknown): val is ItemV1 =>
  isObject<ItemV1>(val) &&
  typeof val.id === "string" &&
  typeof val.label === "string" &&
  typeof val.from === "string" &&
  typeof val.price === "number" &&
  typeof val.currency === "string" &&
  typeof val.start === "string" &&
  isFrequencyV1(val.frequency);
