import { error } from "@sveltejs/kit";
import { isSignedIn } from "svelte-google-auth";
import type { PushSubscription } from "web-push";
import { isPushSubscription } from "../../../../types/typeGuard";
import type { RequestHandler } from "./$types";
import { NOTIFICATION_SERVICE_API_SECRET, NOTIFICATION_SERVICE_API_URL } from "$env/static/private";

const getSubscriptions = async (sub: string): Promise<PushSubscription[]> => {
  const data = await fetch(`${NOTIFICATION_SERVICE_API_URL}/subscriptions/${sub}`, {
    headers: {
      Authorization: `Bearer ${NOTIFICATION_SERVICE_API_SECRET}`,
    },
  });
  return data.json();
};
const putSubscriptions = async (sub: string, subscriptions: PushSubscription[]) => {
  await fetch(`${NOTIFICATION_SERVICE_API_URL}/subscriptions/${sub}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${NOTIFICATION_SERVICE_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriptions),
  });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
  if (!isSignedIn(locals)) throw error(401);
  const {
    user: { sub },
  } = locals;
  const subscription: unknown = await request.json();
  if (!isPushSubscription(subscription)) throw error(400);

  const subscriptions = await getSubscriptions(sub);
  if (!subscriptions.find(({ endpoint }) => endpoint === subscription.endpoint)) {
    await putSubscriptions(sub, [...subscriptions, subscription]);
  }
  return new Response(null, {
    status: 201,
  });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
  if (!isSignedIn(locals)) throw error(401);
  const {
    user: { sub },
  } = locals;
  const subscription: unknown = await request.json();
  if (!isPushSubscription(subscription)) throw error(400);

  const subscriptions = await getSubscriptions(sub);
  await putSubscriptions(
    sub,
    subscriptions.filter(({ endpoint }) => endpoint !== subscription.endpoint)
  );
  return new Response(null, {
    status: 200,
  });
};
