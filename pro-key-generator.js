const fs = require("fs");
const crypto = require("crypto");

const KEY_FILE = "./pro-keys.json";

// Ensure file exists
if (!fs.existsSync(KEY_FILE)) {
  fs.writeFileSync(KEY_FILE, JSON.stringify([]));
}

function generateProKey(type = "customer", seats = 1, email = null) {
  const key = "AMC-" + crypto.randomBytes(6).toString("hex").toUpperCase();

  const record = {
    key,
    type,
    seats,
    email,
    active: true,
    created_at: new Date().toISOString()
  };

  const existing = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  existing.push(record);
  fs.writeFileSync(KEY_FILE, JSON.stringify(existing, null, 2));

  return record;
}

module.exports = { generateProKey };
