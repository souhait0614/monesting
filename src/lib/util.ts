import { differenceInDays, startOfDay } from "date-fns";
import type { Item } from "../types/ItemData";

export const getNextPaymentDate = (
  { start, frequency: { year, month, day } }: Pick<Item, "start" | "frequency">,
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

export const getTrueUUID = (items: Item[]) => {
  let uuid = crypto.randomUUID();
  while (items.find(({ id }) => id === uuid)) {
    uuid = crypto.randomUUID();
  }
  return uuid;
};
