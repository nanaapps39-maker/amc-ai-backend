// routesatcom.js — SATCOM v2 + Telemetry Upgrade
import express from "express";
import {
  runSatcomReasoning,
  getSatcomHeartbeat,
  getSatcomHealth
} from "./satcomEngineConnector.js";

const router = express.Router();

// -------------------------------------------------------
// POST /satcom/reasoning
// -------------------------------------------------------
router.post("/reasoning", async (req, res) => {
  try {
    const { message, module } = req.body;

    if (!message || !module) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: 'message' and 'module'"
      });
    }

    // Forward SATCOM v2 request to Python engine
    const satcomResult = await runSatcomReasoning({ message, module });

    if (!satcomResult.ok) {
      return res.status(500).json({
        status: "error",
        engine: "satcom-v2",
        message: "SATCOM Reasoning Engine v2 unavailable",
        latencyMs: satcomResult.latencyMs,
        details: satcomResult.error
      });
    }

    return res.json({
      status: "ok",
      engine: "satcom-v2",
      latencyMs: satcomResult.latencyMs,
      result: satcomResult.data
    });

  } catch (err) {
    console.error("SATCOM reasoning error:", err.message);

    return res.status(500).json({
      status: "fatal-error",
      engine: "satcom-v2",
      message: "SATCOM Reasoning Engine v2 failed",
      details: err.message
    });
  }
});

// -------------------------------------------------------
// GET /satcom/heartbeat — lightweight microservice ping
// -------------------------------------------------------
router.get("/heartbeat", async (req, res) => {
  const heartbeat = await getSatcomHeartbeat();
  return res.json(heartbeat);
});

// -------------------------------------------------------
// GET /satcom/health — full SATCOM Engine telemetry
// -------------------------------------------------------
router.get("/health", async (req, res) => {
  const health = await getSatcomHealth();
  return res.json(health);
});

export default router;


