import type { PushSubscription } from "web-push";
import { isItemData, type ItemData } from "../types/ItemData";
import type { NotificationData, NotificationDataV1 } from "../types/NotificationData";
import { upgradeItemData } from "./upgradeItemData";
import { upgradeNotificationData } from "./upgradeNotificationData";

export const getItemData = async () => {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error(res.statusText);
  const data: unknown = await res.json();
  if (isItemData(data)) return upgradeItemData(data);
  else throw new Error("Invalid Format");
};
export const setItemData = async (itemData: ItemData) => {
  const res = await fetch("/api/items", {
    method: "POST",
    body: JSON.stringify(upgradeItemData(itemData)),
  });
  if (!res.ok) throw new Error(res.statusText);
};

export const subscribeNotification = async (subscription: PushSubscription) => {
  const res = await fetch("/api/notifications/subscribe", {
    method: "PUT",
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error(res.statusText);
};

export const unsubscribeNotification = async (subscription: PushSubscription) => {
  const res = await fetch("/api/notifications/subscribe", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error(res.statusText);
};

export const getNotificationData = async (): Promise<NotificationDataV1> => {
  const res = await fetch("/api/notifications");
  if (!res.ok) throw new Error(res.statusText);
  return upgradeNotificationData(await res.json());
};
export const setNotificationData = async (notificationData: NotificationData) => {
  const res = await fetch("/api/notifications", {
    method: "POST",
    body: JSON.stringify(upgradeNotificationData(notificationData)),
  });
  if (!res.ok) throw new Error(res.statusText);
};
