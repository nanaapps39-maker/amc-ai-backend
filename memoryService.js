// ======================================================
// AMC Academy Tech AI R&D Labs
// Memory Engine v1
// ======================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_FILE = path.join(
  __dirname,
  "memoryStore.json"
);

// ------------------------------------
// Load Memory Database
// ------------------------------------

function loadDatabase() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      return { users: {} };
    }

    const raw = fs.readFileSync(
      MEMORY_FILE,
      "utf8"
    );

    return JSON.parse(raw);

  } catch (err) {

    console.error(
      "Memory load error:",
      err.message
    );

    return { users: {} };
  }
}

// ------------------------------------
// Save Memory Database
// ------------------------------------

function saveDatabase(data) {
  try {

    fs.writeFileSync(
      MEMORY_FILE,
      JSON.stringify(data, null, 2)
    );

    return true;

  } catch (err) {

    console.error(
      "Memory save error:",
      err.message
    );

    return false;
  }
}

// ------------------------------------
// Save User Memory
// ------------------------------------

function saveMemory(
  userId,
  memoryData
) {

  const db = loadDatabase();

  db.users[userId] = {
    ...memoryData,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db);

  return db.users[userId];
}

// ------------------------------------
// Load User Memory
// ------------------------------------

function loadMemory(userId) {

  const db = loadDatabase();

  return (
    db.users[userId] || null
  );
}

// ------------------------------------
// Delete User Memory
// ------------------------------------

function deleteMemory(userId) {

  const db = loadDatabase();

  delete db.users[userId];

  saveDatabase(db);

  return true;
}

// ------------------------------------
// Continue Session
// ------------------------------------

function continueSession(userId) {

  const memory = loadMemory(userId);

  if (!memory) {
    return {
      found: false,
      message:
        "No previous session found."
    };
  }

  return {
    found: true,
    role: memory.role,
    lastTopic: memory.lastTopic,
    lastModule: memory.lastModule,
    lastSummary: memory.lastSummary,
    updatedAt: memory.updatedAt
  };
}

export {
  saveMemory,
  loadMemory,
  deleteMemory,
  continueSession
};