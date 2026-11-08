// ======================================================
// AMC Academy Tech AI R&D Labs
// Memory Engine v2.1
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

  if (!db.users[userId]) {
    db.users[userId] = {};
  }

  if (!db.users[userId].history) {
    db.users[userId].history = [];
  }

  db.users[userId].history.push({

    timestamp: new Date().toISOString(),

    role: memoryData.role,

    lastTopic: memoryData.lastTopic,

    lastModule: memoryData.lastModule,

    lastSummary: memoryData.lastSummary

  });

  // Keep existing Memory Engine v1 compatibility

  db.users[userId].role =
    memoryData.role;

  db.users[userId].lastTopic =
    memoryData.lastTopic;

  db.users[userId].lastModule =
    memoryData.lastModule;

  db.users[userId].lastSummary =
    memoryData.lastSummary;

  db.users[userId].updatedAt =
    new Date().toISOString();

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
// Memory Timeline
// ------------------------------------

function getMemoryTimeline(userId) {

  const db = loadDatabase();

  if (!db.users[userId]) {
    return [];
  }

  const userMemory = db.users[userId];

  if (!userMemory.history) {
    return [];
  }

  return userMemory.history;
}


// ------------------------------------
// Memory Search Engine
// ------------------------------------

function searchMemory(userId, keyword) {

  const history =
    getMemoryTimeline(userId);

  return history.filter(entry =>

    (entry.lastTopic || "")
      .toLowerCase()
      .includes(keyword.toLowerCase())

    ||

    (entry.lastModule || "")
      .toLowerCase()
      .includes(keyword.toLowerCase())

    ||

    (entry.lastSummary || "")
      .toLowerCase()
      .includes(keyword.toLowerCase())

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
  continueSession,
  getMemoryTimeline,
  searchMemory
};