const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Persistent file inside repo
const KEY_FILE = path.join(__dirname, "pro-keys.json");

// Ensure file exists
if (!fs.existsSync(KEY_FILE)) {
  fs.writeFileSync(KEY_FILE, JSON.stringify([]));
}

/**
 * Generate an enterprise-grade Pro Key
 * type: "customer" | "admin" | "corporate"
 * seats: number of allowed seats/devices
 * email: owner email (optional for admin/corporate)
 */
function generateProKey(type = "customer", seats = 1, email = null) {
  // Crypto-secure 4-byte hex, same style as webhook
  const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
  const key = `AMC-PRO-${raw}`;

  const record = {
    key,
    type,
    seats,
    email,
    active: true,
    created_at: new Date().toISOString(),
    // Ready for future expansion:
    // expiry_at: null,
    // notes: null,
    // issued_by: "system" | "admin",
  };

  const existing = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  existing.push(record);
  fs.writeFileSync(KEY_FILE, JSON.stringify(existing, null, 2));

  return record;
}

module.exports = { generateProKey };

// TEST RUNNER (only runs when executing this file directly)
if (require.main === module) {
  const record = generateProKey("customer", 1, "test@example.com");
  console.log("Generated PRO Key:", record.key);
  console.log("Saved record:", record);
}
