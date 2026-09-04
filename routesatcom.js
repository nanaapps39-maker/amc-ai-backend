// routesatcom.js
import express from "express";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

const router = express.Router();

// POST /satcom/reasoning
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
    const result = await runSatcomReasoning({
      message,
      module
    });

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

