export const env = {
  NODE_ENV: (process.env.NODE_ENV || "development") as
    | "development"
    | "test"
    | "production",
  PORT: Number(process.env.PORT || 3000),
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elysia-app",
  DB_NAME: process.env.DB_NAME,
};
