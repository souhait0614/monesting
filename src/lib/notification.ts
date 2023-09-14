import { isPushSubscription } from "../types/typeGuard";
import { subscribeNotification, unsubscribeNotification } from "./fetch";
import { notificationPermission } from "./store";
import { PUBLIC_WEB_PUSH_PUBLIC_KEY } from "$env/static/public";

export const subscribe = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  notificationPermission.set("loading");
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });
  const permission = await Notification.requestPermission();
  notificationPermission.set(permission);
  const subscriptionJson = subscription.toJSON();
  if (permission !== "granted" || !isPushSubscription(subscriptionJson)) return;
  await subscribeNotification(subscriptionJson);
};

export const unsubscribe = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  const subscriptionJson = subscription.toJSON();
  if (!isPushSubscription(subscriptionJson)) return;
  notificationPermission.set("loading");
  await Promise.all([unsubscribeNotification(subscriptionJson), subscription.unsubscribe()]);
  notificationPermission.set("default");
};

export const getIsSubscribeNotification = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;
  return true;
};
