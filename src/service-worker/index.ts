self.addEventListener("push", (evt: PushEvent) => {
  const data = evt.data.text();
  console.log(data);
  const options = {
    body: data,
  } as const satisfies NotificationOptions;
  evt.waitUntil(self.registration.showNotification("テスト", options));
});
self.addEventListener("notificationclick", (evt: NotificationEvent) => {
  evt.notification.close();
});
