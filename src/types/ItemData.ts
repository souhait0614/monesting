import { match } from "ts-pattern";
import { isObject } from "./typeGuard";
import { isItemV1, type ItemV1 } from "./ItemV1";
import { isItemV2, type ItemV2 } from "./ItemV2";
import { isItemV3, type ItemV3 } from "./ItemV3";

export interface ItemDataV1 {
  formatVersion: 1;
  items: ItemV1[];
}

export const isItemDataV1 = (val: unknown): val is ItemDataV1 =>
  isObject<ItemDataV1>(val) &&
  val.formatVersion === 1 &&
  Array.isArray(val.items) &&
  val.items.every((item) => isItemV1(item));

export interface ItemDataV2 {
  formatVersion: 2;
  items: ItemV2[];
}

export const isItemDataV2 = (val: unknown): val is ItemDataV2 =>
  isObject<ItemDataV2>(val) &&
  val.formatVersion === 2 &&
  Array.isArray(val.items) &&
  val.items.every((item) => isItemV2(item));

export interface ItemDataV3 {
  formatVersion: 3;
  items: ItemV3[];
}

export const isItemDataV3 = (val: unknown): val is ItemDataV3 =>
  isObject<ItemDataV3>(val) &&
  val.formatVersion === 3 &&
  Array.isArray(val.items) &&
  val.items.every((item) => isItemV3(item));

export type ItemData = ItemDataV1 | ItemDataV2 | ItemDataV3;

export const isItemData = (val: unknown): val is ItemData =>
  isObject<ItemData>(val) &&
  typeof val.formatVersion === "number" &&
  Array.isArray(val.items) &&
  match(val)
    .with({ formatVersion: 1 }, (data) => data.items.every((item: ItemV1) => isItemV1(item)))
    .with({ formatVersion: 2 }, (data) => data.items.every((item: ItemV2) => isItemV2(item)))
    .with({ formatVersion: 3 }, (data) => data.items.every((item: ItemV3) => isItemV3(item)))
    .exhaustive();

export type Item = ItemData["items"][number];
