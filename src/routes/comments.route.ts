import { Elysia } from "elysia";
import { getCollections, toIdString, toObjectId } from "../config/db";
import { CreateCommentZ, UpdateCommentZ, objectIdZ } from "../model/schemas";

export const commentsRoutes = new Elysia({ prefix: "/comments" })
  .get("/", async () => {
    const { comments } = await getCollections();
    const list = await comments.find({}).sort({ createdAt: -1 }).toArray();
    return list.map(toIdString);
  })
  .get("/:id", async ({ params, set }) => {
    const parse = objectIdZ.safeParse(params.id);
    if (!parse.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const { comments } = await getCollections();
    const doc = await comments.findOne({ _id: toObjectId(params.id) });
    if (!doc) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(doc);
  })
  .post("/", async ({ body, set }) => {
    const parsed = CreateCommentZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { comments } = await getCollections();
    const now = new Date();
    const toInsert = {
      ...parsed.data,
      postId: toObjectId(parsed.data.postId),
      userId: toObjectId(parsed.data.userId),
      createdAt: now,
    };
    const { insertedId } = await comments.insertOne(toInsert as any);
    const created = await comments.findOne({ _id: insertedId });
    set.status = 201;
    return toIdString(created!);
  })
  .put("/:id", async ({ params, body, set }) => {
    const idOk = objectIdZ.safeParse(params.id);
    if (!idOk.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const parsed = UpdateCommentZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { comments } = await getCollections();
    const $set: any = { ...parsed.data };
    if ($set.userId) $set.userId = toObjectId($set.userId);
    if ($set.postId) $set.postId = toObjectId($set.postId);
    await comments.updateOne({ _id: toObjectId(params.id) }, { $set });
    const updated = await comments.findOne({ _id: toObjectId(params.id) });
    if (!updated) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(updated);
  });
