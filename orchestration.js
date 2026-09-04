// Phase 10 – Unified SATCOM AI Orchestration Layer
// SATCOM Reasoning Engine v2 + Renderer v3 Integration

import { renderMessage } from "./rendererMode.js";
import runDiagnosticsEngine from "./diagnosticsEngine.js";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

// -----------------------------------------------------------
// MAIN ORCHESTRATION FUNCTION
// -----------------------------------------------------------
export default async function orchestrate(request) {
  try {
    const { mode, payload } = request;
    let rawResponse;

    switch (mode) {
      // -------------------------------------------------------
      // SATCOM DIAGNOSTICS MODE (Groq + SATCOM v2 merged)
      // -------------------------------------------------------
      case "diagnostics":
        rawResponse = await handleDiagnostics(payload);
        break;

      // -------------------------------------------------------
      // Translator Mode
      // -------------------------------------------------------
      case "translator":
        rawResponse = await handleTranslator(payload);
        break;

      // -------------------------------------------------------
      // Storage Mode
      // -------------------------------------------------------
      case "storage":
        rawResponse = await handleStorage(payload);
        break;

      // -------------------------------------------------------
      // Attachment Mode
      // -------------------------------------------------------
      case "attachments":
        rawResponse = await handleAttachments(payload);
        break;

      // -------------------------------------------------------
      // Orbit Mode
      // -------------------------------------------------------
      case "orbit":
        rawResponse = await handleOrbit(payload);
        break;

      // -------------------------------------------------------
      // Vessel Intelligence Mode
      // -------------------------------------------------------
      case "vessel-intel":
        rawResponse = await handleVesselIntel(payload);
        break;

      // -------------------------------------------------------
      // Unknown Mode
      // -------------------------------------------------------
      default:
        rawResponse = {
          status: "error",
          message: `Unknown mode: ${mode}`,
          hint: "Valid modes: diagnostics, translator, storage, attachments, orbit, vessel-intel"
        };
        break;
    }

    // -----------------------------------------------------------
    // APPLY RENDERER v3 TO ALL OUTPUTS
    // -----------------------------------------------------------
    return renderMessage(rawResponse);

  } catch (err) {
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
  // Run Groq JSON diagnostics engine
  const groqDiagnostics = await runDiagnosticsEngine(payload);

  // Run SATCOM Reasoning Engine v2 (Python microservice)
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
      satcomV2: satcomV2?.status === "ok" ? "active" : "offline"
    },
    diagnostics: {
      groq: groqDiagnostics,
      satcomV2: satcomV2.reasoning || satcomV2
    },
    confidence: satcomV2?.reasoning?.confidence || "Medium"
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


