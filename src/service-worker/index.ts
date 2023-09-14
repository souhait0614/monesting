import type { PushMessage } from "../types/Util";

self.addEventListener("push", (evt: PushEvent) => {
  const data: PushMessage = evt.data.json();
  const options = {
    body: data.body,
  } as const satisfies NotificationOptions;
  evt.waitUntil(self.registration.showNotification(data.title, options));
});
self.addEventListener("notificationclick", (evt: NotificationEvent) => {
  evt.notification.close();
});
