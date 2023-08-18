import type { PushSubscription } from "web-push";
import { isItemDataV2, type ItemData } from "../types/ItemData";
import { upgradeFormat } from "./upgradeFormat";

export const getItemData = async () => {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error(res.statusText);
  const data: unknown = await res.json();
  if (isItemDataV2(data)) return data;
  else throw new Error("Invalid Format");
};
export const setItemData = async (itemData: ItemData) => {
  const res = await fetch("/api/items", {
    method: "POST",
    body: JSON.stringify(upgradeFormat(itemData)),
  });
  if (!res.ok) throw new Error(res.statusText);
};

export const subscribeNotification = async (subscription: PushSubscription) => {
  const res = await fetch("/api/notification/subscribe", {
    method: "PUT",
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error(res.statusText);
};

export const unsubscribeNotification = async (subscription: PushSubscription) => {
  const res = await fetch("/api/notification/subscribe", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error(res.statusText);
};
