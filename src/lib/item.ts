import type { Item, ItemData } from "../types/ItemData";
import { getTrueUUID } from "./util";

export const addItem = (item: Omit<Item, "id">, itemData: ItemData) => {
  const uuid = getTrueUUID(itemData.items);
  const newItems: Item[] = [
    ...itemData.items,
    {
      ...item,
      id: uuid,
    },
  ];
  const newItemData: ItemData = {
    formatVersion: 1,
    items: newItems,
  };
  return newItemData;
};

export const updateItem = (item: Item, itemData: ItemData) => {
  const newItems: Item[] = [...itemData.items];
  const index = newItems.findIndex(({ id }) => id === item.id);
  if (index <= -1) throw new Error("更新対象見つからん");
  newItems[index] = item;

  const newItemData: ItemData = {
    formatVersion: 1,
    items: newItems,
  };
  return newItemData;
};

export const removeItem = (itemId: string, itemData: ItemData) => {
  const newItems: Item[] = [...itemData.items].filter(({ id }) => id !== itemId);
  const newItemData: ItemData = {
    formatVersion: 1,
    items: newItems,
  };
  return newItemData;
};
