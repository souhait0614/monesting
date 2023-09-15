import * as winston from "winston";
import { PUBLIC_LOG_LEVEL } from "$env/static/public";

const log_level = ["debug", "info", "warn", "error"];

if (!log_level.includes(PUBLIC_LOG_LEVEL))
  throw new Error(`For ${PUBLIC_LOG_LEVEL}, specify one of "debug", "info", "warn", or "error".`);

export const logger = winston.createLogger({
  level: PUBLIC_LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.cli(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});
