import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proKeysFile = path.join(__dirname, "pro-keys.json");

export function getLatestProKey() {
  if (!fs.existsSync(proKeysFile)) return null;

  const raw = fs.readFileSync(proKeysFile, "utf8");
  const keys = JSON.parse(raw);

  if (!Array.isArray(keys) || keys.length === 0) return null;

  return keys[keys.length - 1]; // last generated key
}
