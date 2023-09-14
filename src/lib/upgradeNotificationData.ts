import { match } from "ts-pattern";
import type { NotificationData, NotificationDataV1 } from "../types/NotificationData";
import { USING_NOTIFICATION_DATA_FORMAT_VERSION } from "./const";

const upgrade = {} as const;

export const upgradeNotificationData = (notificationData: NotificationData) => {
  let tempNotificationData = structuredClone(notificationData);
  while (tempNotificationData.formatVersion < USING_NOTIFICATION_DATA_FORMAT_VERSION) {
    tempNotificationData = match(tempNotificationData)
      .with({ formatVersion: 1 }, (data) => data)
      .exhaustive();
  }
  return tempNotificationData as NotificationDataV1;
};
