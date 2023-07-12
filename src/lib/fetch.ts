import type { ItemData } from "../types/ItemData";
import { isObject } from "../types/typeGuard";

const isItemData = (val: unknown): val is ItemData =>
  isObject<ItemData>(val) && Object.hasOwn(val, "formatVersion") && val.formatVersion === "1";

export const getItems = async () => {
  const object: unknown = await fetch("/api/items").then((res) => res.json());
  if (isItemData(object)) return object;
  else throw new Error("invalid format");
};
