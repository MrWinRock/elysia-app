import { Elysia } from "elysia";

type LogLevel = "debug" | "info" | "warn" | "error";

const base = {
  service: "elysia-app",
};

const write = (level: LogLevel, msg: string, meta?: Record<string, unknown>) => {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    msg,
    ...base,
    ...(meta || {}),
  });
  // eslint-disable-next-line no-console
  console.log(line);
};

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => write("debug", msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => write("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => write("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => write("error", msg, meta),
  child: (meta: Record<string, unknown>) => ({
    debug: (msg: string, extra?: Record<string, unknown>) => write("debug", msg, { ...meta, ...(extra || {}) }),
    info: (msg: string, extra?: Record<string, unknown>) => write("info", msg, { ...meta, ...(extra || {}) }),
    warn: (msg: string, extra?: Record<string, unknown>) => write("warn", msg, { ...meta, ...(extra || {}) }),
    error: (msg: string, extra?: Record<string, unknown>) => write("error", msg, { ...meta, ...(extra || {}) }),
  }),
};

export const requestLogger = () =>
  new Elysia({ name: "request-logger" })
    .state("__start", 0)
    .onRequest(({ request, store }) => {
      // mark start time
      store.__start = performance.now();
      logger.info("request:start", {
        method: request.method,
        url: request.url,
      });
    })
    .onAfterHandle(({ request, set, store }) => {
      const duration = Math.round((performance.now() - (store.__start || 0)) * 1000) / 1000;
      logger.info("request:end", {
        method: request.method,
        url: request.url,
        status: set.status || 200,
        duration_ms: duration,
      });
    })
    .onError(({ code, error, set, request }) => {
      set.status = set.status || 500;
      const err: any = error as any;
      logger.error("request:error", {
        method: request.method,
        url: request.url,
        code,
        message: err?.message,
        stack: err?.stack,
      });
    });
