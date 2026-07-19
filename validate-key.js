const fs = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "pro-keys.json");

function validateProKey(req) {
  // ⭐ Accept key from BOTH body and header
  const key =
    req.body?.key ||
    req.headers["x-access-key"] ||
    req.headers["x-pro-key"] || // optional fallback
    req.headers["authorization"]; // optional fallback

  if (!key || key.trim() === "") {
    return null;
  }

  let keys = [];
  try {
    keys = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  } catch (err) {
    return null;
  }

  const match = keys.find(k => k.key === key);

  if (!match || !match.active) {
    return null;
  }

  return {
    email: match.email,
    created_at: match.created_at,
    status: "active",
    type: match.type || "customer",
    seats: match.seats || 1
  };
}

module.exports = { validateProKey };



