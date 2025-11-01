import { Elysia } from "elysia";
import { getCollections, toIdString, toObjectId } from "../config/db";
import { CreateUserZ, UpdateUserZ, objectIdZ } from "../model/schemas";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    const { users } = await getCollections();
    const list = await users.find({}).sort({ createdAt: -1 }).toArray();
    return list.map(toIdString);
  })
  .get("/:id", async ({ params, set }) => {
    const parse = objectIdZ.safeParse(params.id);
    if (!parse.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const { users } = await getCollections();
    const doc = await users.findOne({ _id: toObjectId(params.id) });
    if (!doc) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(doc);
  })
  .post("/", async ({ body, set }) => {
    const parsed = CreateUserZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { users } = await getCollections();
    const toInsert = { ...parsed.data, createdAt: new Date() };
    const { insertedId } = await users.insertOne(toInsert as any);
    const created = await users.findOne({ _id: insertedId });
    set.status = 201;
    return toIdString(created!);
  })
  .put("/:id", async ({ params, body, set }) => {
    const idOk = objectIdZ.safeParse(params.id);
    if (!idOk.success) {
      set.status = 400;
      return { error: "invalid id" };
    }
    const parsed = UpdateUserZ.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: parsed.error.flatten() };
    }
    const { users } = await getCollections();
    await users.updateOne({ _id: toObjectId(params.id) }, { $set: { ...parsed.data } });
    const updated = await users.findOne({ _id: toObjectId(params.id) });
    if (!updated) {
      set.status = 404;
      return { error: "not found" };
    }
    return toIdString(updated);
  });
