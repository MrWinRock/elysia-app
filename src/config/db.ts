import { MongoClient, Db, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elysia-app";
const dbName = process.env.DB_NAME || new URL(uri).pathname.replace(/^\//, "") || "elysia-app";

let client: MongoClient | null = null;
let db: Db | null = null;

export interface UserDoc {
    _id?: ObjectId;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface PostDoc {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    content: string;
    likes: number;
    createdAt: Date;
}

export interface CommentDoc {
    _id?: ObjectId;
    postId: ObjectId;
    userId: ObjectId;
    content: string;
    createdAt: Date;
}

export const ensureDb = async (): Promise<Db> => {
    if (db) return db;
    if (!client) {
        client = new MongoClient(uri);
    }
    await client.connect();
    db = client.db(dbName || undefined);
    return db;
};

export const getCollections = async () => {
    const database = await ensureDb();
    return {
        users: database.collection<UserDoc>("users"),
        posts: database.collection<PostDoc>("posts"),
        comments: database.collection<CommentDoc>("comments"),
    };
};

export const toObjectId = (id: string) => new ObjectId(id);

export const toIdString = <T extends { _id?: ObjectId }>(doc: T) => ({
    ...doc,
    _id: (doc._id as ObjectId).toHexString(),
});
