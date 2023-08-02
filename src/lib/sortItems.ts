import type { ItemV2 } from "../types/ItemV2";
import type { SORT_BY, SORT_ORDER } from "./const";
import { getNextPaymentDate } from "./util";

export const sortItems = (items: ItemV2[], by: SORT_BY, order: SORT_ORDER) => {
  const tempItems = [...items];
  const orderNum = order === "asc" ? 1 : -1;
  if (by === "date") {
    const now = new Date();
    return tempItems.sort(
      (a, b) => (getNextPaymentDate(a, now).getTime() - getNextPaymentDate(b, now).getTime()) * orderNum
    );
  }
  if (by === "name") {
    return tempItems.sort((a, b) => {
      if (a.label < b.label) return -1 * orderNum;
      if (a.label > b.label) return 1 * orderNum;
      return 0;
    });
  }
  throw new Error("invalid args");
};
