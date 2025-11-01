# Logging & best practices

This service emits structured JSON logs to stdout. Use a log collector (e.g., docker logs, systemd, or a log agent) to ship logs to your platform.

## Request logs

A request logging plugin records each request lifecycle:

- request:start — method and URL
- request:end — method, URL, status, and duration_ms
- request:error — error details with stack trace

### Example line

```json
{"time":"2025-11-01T00:00:00.000Z","level":"info","msg":"request:end","service":"elysia-app","method":"GET","url":"/users","status":200,"duration_ms":3.1}
```

## Principles

- Prefer structured logs (JSON) over plain text.
- Log at INFO for normal request completion, DEBUG for verbose development details, WARN for recoverable issues, and ERROR for failures.
- Never log secrets (passwords, tokens, full connection strings). Redact sensitive fields.
- Emit logs to stdout/stderr and let the runtime handle file rotation.
- Correlate: include request identifiers if you add auth/gateway layers.

## Shipping logs to files (optional)

In development, you can pipe to a file:

```powershell
bun run dev
```

In production containers, rely on the container runtime and centralized log collection instead of writing files directly.
