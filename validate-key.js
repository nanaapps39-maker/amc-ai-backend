const fs = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "pro-keys.json");

function validateProKey(req) {
  const key =
    req.body?.key ||
    req.headers["x-access-key"] ||
    req.headers["x-pro-key"] ||
    req.headers["authorization"];

  if (!key || key.trim() === "") {
    return { status: "inactive" };
  }

  let keys = [];
  try {
    keys = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  } catch (err) {
    return { status: "inactive" };
  }

  const match = keys.find(k => k.key === key);

  if (!match || !match.active) {
    return { status: "inactive" };
  }

  return {
    status: "active",
    email: match.email,
    type: match.type,
    seats: match.seats,
    created_at: match.created_at
  };
}

module.exports = { validateProKey };

