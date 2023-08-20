import { isFrequencyV2, type FrequencyV2 } from "./ItemV2";
import { isObject } from "./typeGuard";

export interface NotificationV1 {
  id: string;
  label: string;
  price: number;
  currency: string;
  start: string;
  frequency: FrequencyV2;
  send: number | false;
}

export const isNotificationV1 = (val: unknown): val is NotificationV1 =>
  isObject<NotificationV1>(val) &&
  typeof val.id === "string" &&
  typeof val.label === "string" &&
  typeof val.price === "number" &&
  typeof val.currency === "string" &&
  typeof val.start === "string" &&
  isFrequencyV2(val.frequency) &&
  (typeof val.send === "number" || val.send === false);
