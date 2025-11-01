import { Elysia } from "elysia";
import { usersRoutes } from "./routes/users.route";
import { postsRoutes } from "./routes/posts.route";
import { commentsRoutes } from "./routes/comments.route";
import { requestLogger, logger } from "./lib/logger";
import { env } from "./config/env";

const app = new Elysia({ precompile: true })
  .use(requestLogger())
  .get("/health", () => ({ ok: true }))
  .use(usersRoutes)
  .use(postsRoutes)
  .use(commentsRoutes)
  .listen(env.PORT);

logger.info("server:started", {
  host: app.server?.hostname,
  port: app.server?.port,
  env: env.NODE_ENV,
});
