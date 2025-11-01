# API

Base URL: `http://localhost:3000`

All IDs are MongoDB ObjectId hex strings.

## Health

- GET `/health` → `{ ok: true }`

## Users

- GET `/users`
- GET `/users/:id`
- POST `/users`
  - Body: `{ username, email, password }`
- PUT `/users/:id`
  - Body: any subset of `{ username, email, password }`

## Posts

- GET `/posts`
- GET `/posts/:id`
- POST `/posts`
  - Body: `{ userId, title, content, likes? }`
- PUT `/posts/:id`
  - Body: any subset of `{ userId, title, content, likes }`

## Comments

- GET `/comments`
- GET `/comments/:id`
- POST `/comments`
  - Body: `{ postId, userId, content }`
- PUT `/comments/:id`
  - Body: any subset of `{ postId, userId, content }`

### Error format

Errors return JSON with 400/404/500 status codes.

```json
{ "error": "message or Zod error details" }
```
