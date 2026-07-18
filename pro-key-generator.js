const fs = require("fs");
const path = require("path");

// Persistent file inside repo
const KEY_FILE = path.join(__dirname, "pro-keys.json");

// Ensure file exists
if (!fs.existsSync(KEY_FILE)) {
  fs.writeFileSync(KEY_FILE, JSON.stringify([]));
}

function generateProKey(type = "customer", seats = 1, email = null) {
  const key = "AMC-" + Math.random().toString(16).substring(2, 14).toUpperCase();

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
