import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import defaultContent from "../../shared/defaultContent.js";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "app_state";
const STORE_DOC_ID = "singleton";

let clientPromise = null;

function getClient() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI. Set your MongoDB Atlas connection string in environment variables.");
  }
  if (!clientPromise) {
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getCollection() {
  const client = await getClient();
  return client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
}

async function ensureSeedDocument() {
  const collection = await getCollection();
  const existing = await collection.findOne({ _id: STORE_DOC_ID });
  if (existing) return;

  const initialPasscode = process.env.ADMIN_PASSCODE;
  if (!initialPasscode) {
    throw new Error("Missing ADMIN_PASSCODE environment variable.");
  }
  const passcodeHash = await bcrypt.hash(initialPasscode, 10);
  await collection.insertOne({
    _id: STORE_DOC_ID,
    content: defaultContent,
    passcodeHash,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function readStore() {
  await ensureSeedDocument();
  const collection = await getCollection();
  const data = await collection.findOne(
    { _id: STORE_DOC_ID },
    { projection: { content: 1, passcodeHash: 1 } }
  );
  if (!data) {
    throw new Error("Failed to read app state from MongoDB.");
  }
  return {
    content: data.content,
    passcodeHash: data.passcodeHash
  };
}

export async function writeStore(nextStore) {
  await ensureSeedDocument();
  const collection = await getCollection();
  await collection.updateOne(
    { _id: STORE_DOC_ID },
    {
      $set: {
        content: nextStore.content,
        passcodeHash: nextStore.passcodeHash,
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true }
  );
}
