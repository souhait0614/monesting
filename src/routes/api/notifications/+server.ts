import { error, json } from "@sveltejs/kit";
import { isSignedIn } from "svelte-google-auth";
import type { NotificationData, NotificationDataV1 } from "../../../types/NotificationData";
import type { RequestHandler } from "./$types";

import { NOTIFICATION_STORAGE_API_SECRET, NOTIFICATION_STORAGE_API_URL } from "$env/static/private";

const getNotifications = async (sub: string): Promise<NotificationDataV1> => {
  const res = await fetch(`${NOTIFICATION_STORAGE_API_URL}/notifications/${sub}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${NOTIFICATION_STORAGE_API_SECRET}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

const putNotifications = async (sub: string, notificationData: NotificationDataV1) => {
  await fetch(`${NOTIFICATION_STORAGE_API_URL}/notifications/${sub}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${NOTIFICATION_STORAGE_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });
};

export const GET: RequestHandler = async ({ locals }) => {
  if (!isSignedIn(locals)) throw error(401);

  const notificationData = await getNotifications(locals.user.sub);
  return json(notificationData);
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!isSignedIn(locals)) throw error(401);

  const data: NotificationData = await request.json();

  await putNotifications(locals.user.sub, data);

  return json(data, {
    status: 201,
  });
};
