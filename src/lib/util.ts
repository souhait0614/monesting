import { differenceInDays, startOfDay } from "date-fns";
import type { ItemV2 } from "../types/ItemV2";

export const getNextPaymentDate = (
  { start, frequency: { year, month, day } }: Pick<ItemV2, "start" | "frequency">,
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

export const getTrueUUID = (items: ItemV2[]) => {
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
