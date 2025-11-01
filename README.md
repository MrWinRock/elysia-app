# Elysia + MongoDB API

Simple REST API built with [Elysia](https://elysiajs.com/) on Bun, using MongoDB and Zod validation.

## Prerequisites

- Bun 1.x installed
- A MongoDB connection string

Create `.env.local` in the project root (already supported by Bun) with:

```dotenv
MONGODB_URI=<your mongodb uri>
# Optional override
# DB_NAME=<database name>
```

## Install & run

```bash
bun install
bun run dev
```

Server will start on <http://localhost:3000>

## Endpoints

- GET  /health → { ok: true }

Users

- GET  /users
- GET  /users/:id
- POST /users         (body: { username, email, password })
- PUT  /users/:id     (body: any subset of fields)

Posts

- GET  /posts
- GET  /posts/:id
- POST /posts         (body: { userId, title, content, likes? })
- PUT  /posts/:id     (body: any subset of fields; userId can be changed)

Comments

- GET  /comments
- GET  /comments/:id
- POST /comments      (body: { postId, userId, content })
- PUT  /comments/:id  (body: any subset of fields; postId/userId can be changed)

Notes

- All IDs are MongoDB ObjectId hex strings.
- Responses return `_id` as a string for convenience.
- Validation errors return HTTP 400 with details; missing records return 404.

## Docs

- Architecture: `docs/architecture.md`
- API: `docs/api.md`
- Logging: `docs/logging.md`
