import { isObject } from "./typeGuard";

export interface FrequencyV3 {
  year: number;
  month: number;
  day: number;
}

export const isFrequencyV3 = (val: unknown): val is FrequencyV3 =>
  isObject<FrequencyV3>(val) &&
  typeof val.year === "number" &&
  typeof val.month === "number" &&
  typeof val.day === "number";

export interface ItemV3 {
  id: string;
  label: string;
  from: string;
  price: number;
  currency: string;
  start: string;
  frequency: FrequencyV3;
  note: string;
  sendNotification: number | false;
}

export const isItemV3 = (val: unknown): val is ItemV3 =>
  isObject<ItemV3>(val) &&
  typeof val.id === "string" &&
  typeof val.label === "string" &&
  typeof val.from === "string" &&
  typeof val.price === "number" &&
  typeof val.currency === "string" &&
  typeof val.start === "string" &&
  isFrequencyV3(val.frequency) &&
  typeof val.note === "string" &&
  (typeof val.sendNotification === "number" || val.sendNotification === false);
