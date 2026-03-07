import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs/promises";
import { readStore, writeStore } from "./store.js";

const app = express();
const PORT = Number(process.env.PORT || 8787);
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const JWT_EXPIRES = process.env.ADMIN_JWT_EXPIRES || "12h";

if (!JWT_SECRET) {
  throw new Error("Missing ADMIN_JWT_SECRET environment variable.");
}

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: true
  })
);

function getToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const token = getToken(req);
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.admin = payload;
  return next();
}

function validateContent(content) {
  if (!content || typeof content !== "object") return false;
  return Boolean(content.hero && content.about && content.portfolio && content.contact);
}

app.get("/api/content", async (_req, res) => {
  const store = await readStore();
  res.json({ content: store.content });
});

app.put("/api/content", requireAdmin, async (req, res) => {
  const nextContent = req.body?.content;
  if (!validateContent(nextContent)) {
    return res.status(400).json({ error: "Invalid content payload" });
  }
  const store = await readStore();
  store.content = nextContent;
  await writeStore(store);
  return res.json({ ok: true });
});

app.post("/api/admin/login", async (req, res) => {
  const passcode = String(req.body?.passcode || "");
  if (!passcode) {
    return res.status(400).json({ error: "Passcode is required" });
  }
  const store = await readStore();
  const isValid = await bcrypt.compare(passcode, store.passcodeHash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid passcode" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return res.json({ token });
});

app.get("/api/admin/session", (req, res) => {
  const token = getToken(req);
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ isAdmin: true });
});

app.post("/api/admin/logout", (_req, res) => {
  res.json({ ok: true });
});

app.patch("/api/admin/passcode", requireAdmin, async (req, res) => {
  const currentPasscode = String(req.body?.currentPasscode || "");
  const newPasscode = String(req.body?.newPasscode || "");

  if (!currentPasscode || !newPasscode) {
    return res.status(400).json({ error: "Current and new passcodes are required" });
  }
  if (newPasscode.length < 8) {
    return res.status(400).json({ error: "New passcode must be at least 8 characters" });
  }

  const store = await readStore();
  const validCurrent = await bcrypt.compare(currentPasscode, store.passcodeHash);
  if (!validCurrent) {
    return res.status(401).json({ error: "Current passcode is incorrect" });
  }

  store.passcodeHash = await bcrypt.hash(newPasscode, 10);
  await writeStore(store);
  return res.json({ ok: true });
});

const distPath = path.resolve("frontend", "dist");

app.use(express.static(distPath));

app.use(async (req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  try {
    const indexFile = path.join(distPath, "index.html");
    const html = await fs.readFile(indexFile, "utf-8");
    res.type("html").send(html);
  } catch {
    res.status(404).send("Build not found. Run `npm run build` first.");
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
