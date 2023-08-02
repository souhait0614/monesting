import type { ItemDataV2 } from "../types/ItemData";
import type { ItemV2 } from "../types/ItemV2";
import { getTrueUUID } from "./util";

export const addItem = (item: Omit<ItemV2, "id">, itemData: ItemDataV2) => {
  const uuid = getTrueUUID(itemData.items);
  const newItems: ItemV2[] = [
    ...itemData.items,
    {
      ...item,
      id: uuid,
    },
  ];
  const newItemData: ItemDataV2 = {
    formatVersion: 2,
    items: newItems,
  };
  return newItemData;
};

export const updateItem = (item: ItemV2, itemData: ItemDataV2) => {
  const newItems: ItemV2[] = [...itemData.items];
  const index = newItems.findIndex(({ id }) => id === item.id);
  if (index <= -1) throw new Error("更新対象見つからん");
  newItems[index] = item;

  const newItemData: ItemDataV2 = {
    formatVersion: 2,
    items: newItems,
  };
  return newItemData;
};

export const removeItem = (itemId: string, itemData: ItemDataV2) => {
  const newItems: ItemV2[] = [...itemData.items].filter(({ id }) => id !== itemId);
  const newItemData: ItemDataV2 = {
    formatVersion: 2,
    items: newItems,
  };
  return newItemData;
};
