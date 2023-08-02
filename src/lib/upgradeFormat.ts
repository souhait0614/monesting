import { match } from "ts-pattern";
import type { ItemData, ItemDataV1, ItemDataV2 } from "../types/ItemData";
import { USING_ITEM_DATA_FORMAT_VERSION } from "./const";

const v1Tov2 = (itemData: ItemDataV1): ItemDataV2 => ({
  formatVersion: 2,
  items: itemData.items.map((item) => ({
    ...item,
    note: "",
  })),
});

export const upgradeFormat = (itemData: ItemData) => {
  let tempItemData = structuredClone(itemData);
  while (tempItemData.formatVersion < USING_ITEM_DATA_FORMAT_VERSION) {
    tempItemData = match(tempItemData)
      .with({ formatVersion: 1 }, (data) => v1Tov2(data))
      .with({ formatVersion: 2 }, (data) => data)
      .exhaustive();
  }
  return tempItemData as ItemDataV2;
};