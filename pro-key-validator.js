// pro-key-validator.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRO_KEYS_PATH = path.join(__dirname, "pro-keys.json");

export function validateProKey(key) {
  let keys = [];

  // Load from Render env first
  try {
    keys = JSON.parse(process.env.PRO_KEYS_JSON || "[]");
  } catch {
    keys = [];
  }

  // Fallback to local file
  if (keys.length === 0 && fs.existsSync(PRO_KEYS_PATH)) {
    keys = JSON.parse(fs.readFileSync(PRO_KEYS_PATH, "utf8"));
  }

  const entry = keys.find(k => k.key === key);

  if (!entry || entry.active !== true) {
    return null;
  }

  return {
    mode: "pro_key_active",
    payload: {
      email: entry.email,
      type: entry.type,
      seats: entry.seats,
      status: entry.active ? "active" : "inactive",
      created_at: entry.created_at,
      expiry_at: entry.expiry_at
    },
    confidence: 1.0
  };
}
