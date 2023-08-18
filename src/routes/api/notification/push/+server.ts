import webPush, { type PushSubscription } from "web-push";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_WEB_PUSH_PUBLIC_KEY } from "$env/static/public";
import {
  CRON_SECRET,
  NOTIFICATION_STORAGE_API_SECRET,
  NOTIFICATION_STORAGE_API_URL,
  WEB_PUSH_PRIVATE_KEY,
} from "$env/static/private";

webPush.setVapidDetails("mailto:hoge@fuga.piyo", PUBLIC_WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY);

const getSubscriptionsList = async (): Promise<Record<string, PushSubscription[]>> => {
  const data = await fetch(`${NOTIFICATION_STORAGE_API_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${NOTIFICATION_STORAGE_API_SECRET}`,
    },
  });
  return data.json();
};

export const POST: RequestHandler = async ({ request }) => {
  const token = request.headers.get("authorization");
  if (!token || !RegExp(`${CRON_SECRET}$`).test(token)) throw error(401);

  const subscriptionsList = await getSubscriptionsList();
  await Promise.allSettled(
    Object.entries(subscriptionsList).map(async ([sub, subscriptions]) => {
      await Promise.allSettled(
        subscriptions.map(async (subscription) => {
          await webPush.sendNotification(subscription, "test notification");
        })
      );
    })
  );

  return new Response(null, {
    status: 200,
  });
};
