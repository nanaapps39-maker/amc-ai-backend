import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load keys from environment (Render-safe)
function loadKeys() {
  try {
    return JSON.parse(process.env.PRO_KEYS_JSON || "[]");
  } catch (err) {
    console.error("❌ Failed to parse PRO_KEYS_JSON:", err);
    return [];
  }
}

// Save updated keys to local file (temporary sync)
function saveKeys(keys) {
  const filePath = path.join(__dirname, "pro-keys.json");
  fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));
  console.log("⚠️ Saved locally. Remember to update PRO_KEYS_JSON in Render.");
}

// ⭐ The actual key generator (this MUST be exported)
export function generateProKey(type = "customer", seats = 1, email = null) {
  const key = "AMC-" + crypto.randomBytes(6).toString("hex").toUpperCase();

  const record = {
    key,
    type,
    seats,
    email,
    active: true,
    created_at: new Date().toISOString(),
    expiry_at: "2027-12-31T23:59:59Z"
  };

  const existing = loadKeys();
  existing.push(record);

  saveKeys(existing);

  return record;
}

// Run generator when executed directly
if (process.argv[1] === __filename) {
  const record = generateProKey("customer", 1, "manual-generator@amcacademy.tech");
  console.log("✅ Generated PRO Key:", record.key);
  console.log("Saved record:", record);
}

