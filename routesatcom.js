// routesatcom.js
import express from "express";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

const router = express.Router();

// POST /satcom/reasoning
router.post("/reasoning", async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload || typeof payload !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Missing or invalid 'payload' (expected SATCOM log lines as string)"
      });
    }

    const result = await runSatcomReasoning(payload);

    return res.json({
      status: "ok",
      engine: "satcom-v2",
      result
    });
  } catch (err) {
    console.error("SATCOM reasoning error:", err.message);

    return res.status(500).json({
      status: "fatal-error",
      message: "SATCOM Reasoning Engine v2 failed",
      details: err.message
    });
  }
});

// GET /satcom/health
router.get("/health", async (req, res) => {
  return res.json({
    status: "ok",
    message: "SATCOM route online"
  });
});

export default router;
