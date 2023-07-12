export const isObject = <T extends object = object>(x: unknown): x is T =>
  x !== null && (typeof x === "object" || typeof x === "function");
