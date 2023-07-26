import type { Item, ItemData } from "../types/ItemData";
import { setItems } from "./fetch";
import { getTrueUUID } from "./util";

export const addItem = async (item: Omit<Item, "id">, itemData: ItemData) => {
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
  await setItems(newItemData);
  return newItems;
};

export const updateItem = async (item: Item, itemData: ItemData) => {
  const newItems: Item[] = [...itemData.items];
  const index = newItems.findIndex(({ id }) => id === item.id);
  if (index <= -1) throw new Error("更新対象見つからん");
  newItems[index] = item;

  const newItemData: ItemData = {
    formatVersion: 1,
    items: newItems,
  };
  await setItems(newItemData);
};

export const removeItem = async (itemId: string, itemData: ItemData) => {
  const newItems: Item[] = [...itemData.items].filter(({ id }) => id !== itemId);
  const newItemData: ItemData = {
    formatVersion: 1,
    items: newItems,
  };
  await setItems(newItemData);
};
