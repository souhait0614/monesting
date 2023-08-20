import { match } from "ts-pattern";
import { isObject } from "./typeGuard";
import { isNotificationV1, type NotificationV1 } from "./NotificationV1";

export interface NotificationDataV1 {
  formatVersion: 1;
  notifications: NotificationV1[];
}

export const isNotificationDataV1 = (val: unknown): val is NotificationDataV1 =>
  isObject<NotificationDataV1>(val) &&
  val.formatVersion === 1 &&
  Array.isArray(val.notifications) &&
  val.notifications.every((notification: NotificationV1) => isNotificationV1(notification));

export type NotificationData = NotificationDataV1;

export const isNotificationData = (val: unknown): val is NotificationData =>
  isObject<NotificationData>(val) &&
  typeof val.formatVersion === "number" &&
  Array.isArray(val.notifications) &&
  match(val)
    .with({ formatVersion: 1 }, (data) => data.notifications.every((item: NotificationV1) => isNotificationV1(item)))
    .exhaustive();

export type Notification = NotificationData["notifications"][number];
