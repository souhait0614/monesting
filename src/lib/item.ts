import type { ItemDataV3 } from "../types/ItemData";
import type { ItemV3 } from "../types/ItemV3";
import { USING_ITEM_DATA_FORMAT_VERSION } from "./const";
import { getTrueUUID } from "./util";

export const addItem = (item: Omit<ItemV3, "id">, itemData: ItemDataV3) => {
  const uuid = getTrueUUID(itemData.items);
  const newItems: ItemV3[] = [
    ...itemData.items,
    {
      ...item,
      id: uuid,
    },
  ];
  const newItemData: ItemDataV3 = {
    formatVersion: USING_ITEM_DATA_FORMAT_VERSION,
    items: newItems,
  };
  return newItemData;
};

export const updateItem = (item: ItemV3, itemData: ItemDataV3) => {
  const newItems: ItemV3[] = [...itemData.items];
  const index = newItems.findIndex(({ id }) => id === item.id);
  if (index <= -1) throw new Error("更新対象見つからん");
  newItems[index] = item;

  const newItemData: ItemDataV3 = {
    formatVersion: USING_ITEM_DATA_FORMAT_VERSION,
    items: newItems,
  };
  return newItemData;
};

export const removeItem = (itemId: string, itemData: ItemDataV3) => {
  const newItems: ItemV3[] = [...itemData.items].filter(({ id }) => id !== itemId);
  const newItemData: ItemDataV3 = {
    formatVersion: USING_ITEM_DATA_FORMAT_VERSION,
    items: newItems,
  };
  return newItemData;
};
