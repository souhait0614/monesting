import type { ItemV3 } from "../types/ItemV3";
import type { SORT_BY, SORT_ORDER } from "./const";
import { getNextPaymentDate } from "./util";

export const SORT_BY_ITEM = {
  name: ["label"],
  date: ["start", "frequency"],
} as const satisfies {
  [K in SORT_BY]: ReadonlyArray<keyof ItemV3>;
};

export type SORT_BY_ITEM = {
  [K in keyof typeof SORT_BY_ITEM]: (typeof SORT_BY_ITEM)[K][number];
};

export const sortItems = <T extends Pick<ItemV3, "id" | SORT_BY_ITEM[SORT_BY]>>(
  items: T[],
  by: SORT_BY,
  order: SORT_ORDER
): T[] => {
  const orderNum = order === "asc" ? 1 : -1;
  if (by === "date") {
    const now = new Date();
    return items.sort(
      (a, b) => (getNextPaymentDate(a, now).getTime() - getNextPaymentDate(b, now).getTime()) * orderNum
    );
  }
  if (by === "name") {
    return items.sort((a, b) => {
      if (a.label < b.label) return -1 * orderNum;
      if (a.label > b.label) return 1 * orderNum;
      return 0;
    });
  }
  throw new Error("invalid args");
};
