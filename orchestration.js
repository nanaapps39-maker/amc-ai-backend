// Phase 10 – Unified SATCOM AI Orchestration Layer
// SATCOM Reasoning Engine v2 + Renderer v3 Integration

import { renderMessage } from "./rendererMode.js";
import runDiagnosticsEngine from "./diagnosticsEngine.js";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

// -----------------------------------------------------------
// ORCHESTRATION TELEMETRY SNAPSHOT
// -----------------------------------------------------------
const orchestrationTelemetry = {
  lastMode: null,
  lastEngine: null,
  lastDurationMs: null,
  lastTimestamp: null,
  lastError: null,
  lastPayloadSize: null
};

export function getHealth() {
  return {
    status: "ok",
    telemetry: orchestrationTelemetry
  };
}

// -----------------------------------------------------------
// MAIN ORCHESTRATION FUNCTION
// -----------------------------------------------------------
export default async function orchestrate(request) {
  const start = Date.now();

  try {
    const { mode, payload } = request;
    let rawResponse;

    // Update telemetry (pre‑execution)
    orchestrationTelemetry.lastMode = mode;
    orchestrationTelemetry.lastTimestamp = new Date().toISOString();
    orchestrationTelemetry.lastPayloadSize = JSON.stringify(payload)?.length || 0;

    switch (mode) {
      case "diagnostics":
        rawResponse = await handleDiagnostics(payload);
        orchestrationTelemetry.lastEngine = "diagnostics";
        break;

      case "translator":
        rawResponse = await handleTranslator(payload);
        orchestrationTelemetry.lastEngine = "translator";
        break;

      case "storage":
        rawResponse = await handleStorage(payload);
        orchestrationTelemetry.lastEngine = "storage";
        break;

      case "attachments":
        rawResponse = await handleAttachments(payload);
        orchestrationTelemetry.lastEngine = "attachments";
        break;

      case "orbit":
        rawResponse = await handleOrbit(payload);
        orchestrationTelemetry.lastEngine = "orbit";
        break;

      case "vessel-intel":
        rawResponse = await handleVesselIntel(payload);
        orchestrationTelemetry.lastEngine = "vessel-intel";
        break;

      // ⭐ NEW — Future Trends Engine (Phase 5 Activation)
      case "future-trends":
        rawResponse = await handleFutureTrends(payload);
        orchestrationTelemetry.lastEngine = "future-trends";
        break;

      default:
        rawResponse = {
          status: "error",
          message: `Unknown mode: ${mode}`,
          hint: "Valid modes: diagnostics, translator, storage, attachments, orbit, vessel-intel, future-trends"
        };
        orchestrationTelemetry.lastEngine = "unknown";
        break;
    }

    // Update duration telemetry
    orchestrationTelemetry.lastDurationMs = Date.now() - start;

    return renderMessage(rawResponse);

  } catch (err) {
    orchestrationTelemetry.lastError = {
      message: err.message,
      time: new Date().toISOString()
    };

    return renderMessage({
      status: "fatal-error",
      message: "Orchestration layer encountered an unexpected error.",
      details: err.message
    });
  }
}

// -----------------------------------------------------------
// MODE HANDLERS
// -----------------------------------------------------------

// ⭐ Diagnostics Mode — SATCOM v2 + Groq JSON Engine
async function handleDiagnostics(payload) {
  const groqDiagnostics = await runDiagnosticsEngine(payload);

  let satcomV2;
  try {
    satcomV2 = await runSatcomReasoning(payload);
  } catch (err) {
    satcomV2 = {
      status: "error",
      message: "SATCOM Reasoning Engine v2 unavailable",
      details: err.message
    };
  }

  return {
    mode: "diagnostics",
    status: "ok",
    engines: {
      groq: "active",
      satcomV2: satcomV2?.ok ? "active" : "offline"
    },
    diagnostics: {
      groq: groqDiagnostics,
      satcomV2: satcomV2.data || satcomV2
    },
    confidence: satcomV2?.data?.confidence || "Medium"
  };
}

// -----------------------------------------------------------
// Placeholder Modes (still functional)
// -----------------------------------------------------------
async function handleTranslator(payload) {
  return { mode: "translator", status: "ok", payload };
}

async function handleStorage(payload) {
  return { mode: "storage", status: "ok", payload };
}

async function handleAttachments(payload) {
  return { mode: "attachments", status: "ok", payload };
}

async function handleOrbit(payload) {
  return { mode: "orbit", status: "ok", payload };
}

async function handleVesselIntel(payload) {
  return { mode: "vessel-intel", status: "ok", payload };
}

// -----------------------------------------------------------
// ⭐ Future Trends Engine — Phase 5 Handler
// -----------------------------------------------------------
async function handleFutureTrends(payload) {
  console.log("⚡ Future Trends Mode triggered");

  return {
    mode: "future-trends",
    status: "ok",
    message: "Future Trends Engine active (Phase 5 structure only)",
    payload: payload || null
  };
}






