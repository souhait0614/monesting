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
  if (!token || !RegExp(`${CRON_SECRET}$`).test(token)) throw error(401);
  const now = startOfToday();
  const subscriptionsList = await getSubscriptionsList();
  await Promise.allSettled(
    Object.entries(subscriptionsList).map(async ([sub, subscriptions]) => {
      try {
        const notificationData = await getNotificationData(sub);
        if (!notificationData.enabled) return;
        await Promise.allSettled(
          notificationData.notifications.map(async (notification) => {
            if (notification.send === false) return;
            const nextPaymentDate = getNextPaymentDate(notification, now);
            const notifyDate = subDays(nextPaymentDate, notification.send);
            if (notifyDate.getTime() !== now.getTime()) return;
            await Promise.allSettled(
              subscriptions.map(async (subscription) => {
                try {
                  await webPush.sendNotification(
                    subscription,
                    JSON.stringify(getPushMessage(notification, nextPaymentDate))
                  );
                } catch (error) {
                  console.error(error);
                  throw error;
                }
              })
            );
          })
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    })
  );

  return new Response(null, {
    status: 200,
  });
};
