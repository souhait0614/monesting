import type { PushSubscription } from "web-push";

export const isObject = <T extends object = object>(x: unknown): x is T =>
  x !== null && (typeof x === "object" || typeof x === "function");

export const isPushSubscription = (x: unknown): x is PushSubscription =>
  isObject<PushSubscription>(x) &&
  typeof x.endpoint === "string" &&
  typeof x.keys.auth === "string" &&
  typeof x.keys.p256dh === "string";
