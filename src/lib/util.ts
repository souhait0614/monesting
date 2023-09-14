import { differenceInDays, startOfDay } from "date-fns";
import equal from "fast-deep-equal";
import type { ItemV3 } from "../types/ItemV3";
import type { LayoutData, PageData } from "../routes/$types";
import type { NotificationV1 } from "../types/NotificationV1";
import { sortItems } from "./sortItems";
import type { SORT_BY, SORT_ORDER } from "./const";

export const getNextPaymentDate = (
  { start, frequency: { year, month, day } }: Pick<ItemV3, "start" | "frequency">,
  now: Date
) => {
  if (year <= 0 && month <= 0 && day <= 0) throw new Error("invalid frequency values");
  const date = startOfDay(new Date(start));
  while (differenceInDays(startOfDay(now), date) > 0) {
    if (year) date.setFullYear(date.getFullYear() + year);
    if (month) date.setMonth(date.getMonth() + month);
    if (day) date.setDate(date.getDate() + day);
  }
  return date;
};

export const getTrueUUID = (items: ItemV3[]) => {
  let uuid = crypto.randomUUID();
  while (items.find(({ id }) => id === uuid)) {
    uuid = crypto.randomUUID();
  }
  return uuid;
};

export const openFilePicker = (accept: string = "*"): Promise<FileList | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      resolve(files);
    };
    input.click();
  });
};

export const fileToObject = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", ({ target }) => resolve(JSON.parse(String(target?.result))));
    reader.addEventListener("error", (e) => reject(e));
    reader.readAsText(file);
  });

export const isSignedIn = (data: LayoutData | PageData) => typeof data.auth.user !== "undefined";

export const itemToNotification = ({
  id,
  label,
  price,
  currency,
  start,
  frequency,
  sendNotification,
}: ItemV3): NotificationV1 => ({
  id,
  label,
  price,
  currency,
  start,
  frequency,
  send: sendNotification,
});

export const equalNotificationsFromItems = (
  items: ItemV3[],
  notifications: NotificationV1[],
  sortBy: SORT_BY,
  sortOrder: SORT_ORDER
) => {
  const itemNotifications = items.map((item) => itemToNotification(item));
  return equal(sortItems(itemNotifications, sortBy, sortOrder), sortItems(notifications, sortBy, sortOrder));
};
