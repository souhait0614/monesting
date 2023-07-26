import type { ItemData } from "../types/ItemData";
import { isObject } from "../types/typeGuard";

const isItemData = (val: unknown): val is ItemData =>
  isObject<ItemData>(val) && Object.hasOwn(val, "formatVersion") && val.formatVersion === 1;

export const getItemData = async () => {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error(res.statusText);
  const data: unknown = await res.json();
  if (isItemData(data)) return data;
  else throw new Error("Invalid Format");
};
export const setItemData = async (itemData: ItemData) => {
  const res = await fetch("/api/items", {
    method: "POST",
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error(res.statusText);
};
