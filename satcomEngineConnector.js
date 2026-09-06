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

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`SATCOM engine HTTP ${res.status}: ${text}`);
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
    const res = await fetch(`${SATCOM_ENGINE_URL}/health`, {
      method: "GET",
      timeout: 5000
    });

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

// -------------------------------------------------------
// MarineTraffic Tier 1 Lookup (Optional Helper)
// -------------------------------------------------------
export async function getMarineTrafficData(vessel) {
  try {
    if (!vessel) {
      return { status: "error", error: "Missing vessel name" };
    }

    const url = `https://www.marinetraffic.com/en/ais/details/ships/${encodeURIComponent(vessel)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        status: "error",
        error: `MarineTraffic HTTP ${response.status}`
      };
    }

    const html = await response.text();

    return {
      status: html.includes("Vessel") ? "FOUND" : "UNKNOWN",
      vessel,
      raw: html.substring(0, 2000)
    };

  } catch (err) {
    return {
      status: "error",
      error: err.message
    };
  }
}

export default {
  runSatcomReasoning,
  getSatcomHeartbeat,
  getSatcomHealth,
  getMarineTrafficData   // ⭐ NEW EXPORT
};



