import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadGhanaFleet() {
  const filePath = path.join(__dirname, "ghana_fleet.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}
