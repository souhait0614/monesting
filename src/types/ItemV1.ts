import { isObject } from "./typeGuard";

export interface FrequencyV1 {
  year: number;
  month: number;
  day: number;
}

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
  isObject<FrequencyV1>(val.frequency) &&
  typeof val.frequency.year === "number" &&
  typeof val.frequency.month === "number" &&
  typeof val.frequency.day === "number";
