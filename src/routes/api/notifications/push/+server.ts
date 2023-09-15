import webPush, { type PushSubscription } from "web-push";
import { error } from "@sveltejs/kit";
import { format, startOfToday, subDays } from "date-fns";
import type { NotificationV1 } from "../../../../types/NotificationV1";
import type { NotificationDataV1 } from "../../../../types/NotificationData";
import type { PushMessage } from "../../../../types/Util";
import type { RequestHandler } from "./$types";
import { PUBLIC_WEB_PUSH_PUBLIC_KEY } from "$env/static/public";
import {
  CRON_SECRET,
  NOTIFICATION_STORAGE_API_SECRET,
  NOTIFICATION_STORAGE_API_URL,
  WEB_PUSH_PRIVATE_KEY,
} from "$env/static/private";
import { getNextPaymentDate } from "$lib/util";
import { logger } from "$lib/logger";

process.env.TZ = "Asia/Tokyo";

webPush.setVapidDetails("mailto:hoge@fuga.piyo", PUBLIC_WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY);

const getSubscriptionsList = async (): Promise<Record<string, PushSubscription[]>> => {
  const data = await fetch(`${NOTIFICATION_STORAGE_API_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${NOTIFICATION_STORAGE_API_SECRET}`,
    },
  });
  return data.json();
};
const getNotificationData = async (sub: string): Promise<NotificationDataV1> => {
  const data = await fetch(`${NOTIFICATION_STORAGE_API_URL}/notifications/${sub}`, {
    headers: {
      Authorization: `Bearer ${NOTIFICATION_STORAGE_API_SECRET}`,
    },
  });
  return data.json();
};
const getPushMessage = ({ label, price, currency }: NotificationV1, nextPaymentDate: Date) => {
  const nextPaymentDateString = format(nextPaymentDate, "MM/dd");
  const message: PushMessage = {
    title: `${nextPaymentDateString}に請求が発生します`,
    body: `${nextPaymentDateString}に${label} (${price}${currency})が請求されます。`,
  };
  return message;
};

export const POST: RequestHandler = async ({ request }) => {
  const token = request.headers.get("authorization");
  logger.debug("token", token);
  if (!token || !RegExp(`${CRON_SECRET}$`).test(token)) throw error(401);

  const now = startOfToday();
  logger.debug("now", now);

  const subscriptionsList = await getSubscriptionsList();
  logger.debug("subscriptionsList", subscriptionsList);

  await Promise.allSettled(
    Object.entries(subscriptionsList).map(async ([sub, subscriptions]) => {
      try {
        const notificationData = await getNotificationData(sub);
        logger.debug("notificationData", notificationData);
        if (!notificationData.enabled) return;

        await Promise.allSettled(
          notificationData.notifications.map(async (notification) => {
            logger.debug("notification", notification);
            if (notification.send === false) return;

            const nextPaymentDate = getNextPaymentDate(notification, now);
            logger.debug("nextPaymentDate", nextPaymentDate);
            const notifyDate = subDays(nextPaymentDate, notification.send);
            logger.debug("notifyDate", notifyDate);
            if (notifyDate.getTime() !== now.getTime()) return;

            await Promise.allSettled(
              subscriptions.map(async (subscription) => {
                try {
                  const payload = JSON.stringify(getPushMessage(notification, nextPaymentDate));
                  await webPush.sendNotification(subscription, payload);
                  logger.info("send notification", subscription, payload);
                } catch (error) {
                  logger.error("error", error);
                  throw error;
                }
              })
            );
          })
        );
      } catch (error) {
        logger.error("error", error);
        throw error;
      }
    })
  );

  return new Response(null, {
    status: 200,
  });
};
