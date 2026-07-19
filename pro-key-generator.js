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

// TEST RUNNER (only runs when executing this file directly)
if (require.main === module) {
  const { generateProKey } = require("./pro-key-generator");

  const record = generateProKey("customer", 1, "test@example.com");
  console.log("Generated PRO Key:", record.key);
  console.log("Saved record:", record);
}
