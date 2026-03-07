import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import defaultContent from "../../shared/defaultContent.js";

const DATA_DIR = path.resolve("backend", "server", "data");
const DATA_FILE = path.join(DATA_DIR, "site-data.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const initialPasscode = process.env.ADMIN_PASSCODE || "removed-from-history";
    const passcodeHash = await bcrypt.hash(initialPasscode, 10);
    const initial = {
      content: defaultContent,
      passcodeHash
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readStore() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeStore(nextStore) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(nextStore, null, 2), "utf-8");
}
