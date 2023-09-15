import { Logger } from "tslog";
import { PUBLIC_LOG_LEVEL } from "$env/static/public";

const log_level = ["silly", "trace", "debug", "info", "warn", "error", "fatal"];

if (!log_level.includes(PUBLIC_LOG_LEVEL))
  throw new Error(`For ${PUBLIC_LOG_LEVEL}, specify one of ${log_level.join()}.`);

export const logger = new Logger();
