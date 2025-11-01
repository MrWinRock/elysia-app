# Architecture

This service is built with Bun + Elysia and uses MongoDB for persistence. The codebase is split by responsibility:

```text
src/
  config/
    env.ts          # Environment variables and defaults
  lib/
    logger.ts       # Structured JSON logger and request logging plugin
  routes/
    users.ts        # /users endpoints
    posts.ts        # /posts endpoints
    comments.ts     # /comments endpoints
  db.ts             # MongoDB connection helpers and typed collections
  schemas.ts        # Zod schemas and DTOs
  index.ts          # App bootstrap and route registration
```

Key design choices:

- Validation at the edge with Zod before accessing the database.
- Routes grouped by resource with Elysia route prefixes.
- Minimal shared libs (logger, env) to avoid tight coupling.
- Return Mongo `_id` as a string for client ergonomics.

## Data model

- User: `{ _id, username, email, password, createdAt }`
- Post: `{ _id, userId, title, content, likes, createdAt }`
- Comment: `{ _id, postId, userId, content, createdAt }`

Indexes (recommended):

- `users.email` unique
- `posts.userId`
- `comments.postId`, `comments.userId`

See `docs/api.md` for endpoints.
