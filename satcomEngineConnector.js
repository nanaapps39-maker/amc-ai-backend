const SATCOM_ENGINE_URL = process.env.SATCOM_ENGINE_URL || "http://localhost:9000";

export async function runSatcomReasoning(payload) {
  if (!SATCOM_ENGINE_URL) {
    throw new Error("SATCOM_ENGINE_URL is not defined");
  }

  const url = `${SATCOM_ENGINE_URL}/reasoning`;

  // FIX: send message/module directly, NOT wrapped in { payload }
  const body = payload;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SATCOM engine HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data;
}

export async function checkSatcomHealth() {
  if (!SATCOM_ENGINE_URL) return false;

  try {
    const res = await fetch(`${SATCOM_ENGINE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

