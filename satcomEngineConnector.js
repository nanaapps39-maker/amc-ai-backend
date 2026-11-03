// satcomEngineConnector.js (ESM + Telemetry Upgrade)

const SATCOM_ENGINE_URL =
  process.env.SATCOM_ENGINE_URL || "http://localhost:8000";

// -------------------------------------------------------
// Run SATCOM v2 Reasoning Engine
// -------------------------------------------------------
export async function runSatcomReasoning(payload) {
  if (!SATCOM_ENGINE_URL) {
    throw new Error("SATCOM_ENGINE_URL is not defined");
  }

  const url = `${SATCOM_ENGINE_URL}/reasoning`;
  const start = Date.now();

console.log("SATCOM URL:", url);
console.log("SATCOM Payload:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  console.log("SATCOM Response Status:", res.status);

  const latencyMs = Date.now() - start;

  if (!res.ok) {
    const text = await res.text();

    console.log("SATCOM Error Body:", text);

    throw new Error(
    `SATCOM engine HTTP ${res.status}: ${text}`
   );
 }

    const data = await res.json();

    return {
      ok: true,
      latencyMs,
      data
    };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err.message
    };
  }
}

// -------------------------------------------------------
// Microservice Heartbeat (Lightweight)
// -------------------------------------------------------
export async function getSatcomHeartbeat() {
  try {
    const res = await fetch(`${SATCOM_ENGINE_URL}/heartbeat`, {
      method: "GET",
      timeout: 5000
    });

    if (!res.ok) {
      return { status: "error", error: "Heartbeat failed" };
    }

    const data = await res.json();
    return {
      status: "ok",
      telemetry: data
    };
  } catch (err) {
    return {
      status: "offline",
      error: err.message
    };
  }
}

// -------------------------------------------------------
// Full SATCOM Engine Health (Telemetry + Status)
// -------------------------------------------------------
export async function getSatcomHealth() {
  try {
    const url = `${SATCOM_ENGINE_URL}/health`;

    // First attempt
    let res = await fetch(url, {
      method: "GET",
      timeout: 5000
    });

    // Handle rate-limit (HTTP 429)
    if (res.status === 429) {
      console.log("⚠ SATCOM Engine rate-limited — retrying in 3 seconds...");
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Retry once
      res = await fetch(url, {
        method: "GET",
        timeout: 5000
      });
    }

    // If still failing after retry
    if (!res.ok) {
      return {
        status: "error",
        error: `HTTP ${res.status}`
      };
    }

    const data = await res.json();

    return {
      status: "ok",
      engine: data.engine,
      telemetry: data.telemetry
    };

  } catch (err) {
    return {
      status: "offline",
      error: err.message
    };
  }
}




