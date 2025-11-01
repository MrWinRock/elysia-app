import { Elysia } from "elysia";
import { getCollections, toIdString, toObjectId } from "../config/db";
import { CreatePostZ, UpdatePostZ, objectIdZ } from "../model/schemas";

export const postsRoutes = new Elysia({ prefix: "/posts" })
  .get("/", async () => {
    const { posts } = await getCollections();
    const list = await posts.find({}).sort({ createdAt: -1 }).toArray();
    return list.map(toIdString);
  })
  .get("/:id", async ({ params, set }) => {
    const parse = objectIdZ.safeParse(params.id);
    if (!parse.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const { posts } = await getCollections();
    const doc = await posts.findOne({ _id: toObjectId(params.id) });
    if (!doc) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(doc);
  })
  .post("/", async ({ body, set }) => {
    const parsed = CreatePostZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { posts } = await getCollections();
    const now = new Date();
    const toInsert = {
      ...parsed.data,
      userId: toObjectId(parsed.data.userId),
      createdAt: now,
      likes: parsed.data.likes ?? 0,
    };
    const { insertedId } = await posts.insertOne(toInsert as any);
    const created = await posts.findOne({ _id: insertedId });
    set.status = 201;
    return toIdString(created!);
  })
  .put("/:id", async ({ params, body, set }) => {
    const idOk = objectIdZ.safeParse(params.id);
    if (!idOk.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const parsed = UpdatePostZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { posts } = await getCollections();
    const $set: any = { ...parsed.data };
    if ($set.userId) $set.userId = toObjectId($set.userId);
    await posts.updateOne({ _id: toObjectId(params.id) }, { $set });
    const updated = await posts.findOne({ _id: toObjectId(params.id) });
    if (!updated) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(updated);
  });
