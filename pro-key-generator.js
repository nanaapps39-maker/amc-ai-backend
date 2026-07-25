const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

// Generate key
const newKey = `AMC-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const keys = loadKeys();

keys.push({
    key: newKey,
    type: "customer",
    seats: 1,
    email: "manual-generator@amcacademy.tech",
    active: true,
    created_at: new Date().toISOString(),
    expiry_at: "2027-12-31T23:59:59Z"
});

saveKeys(keys);

console.log(`✅ Generated new Pro Key: ${newKey}`);
