// routes/satcomRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Base URL for SATCOM Engine (FastAPI microservice)
const SATCOM_ENGINE_URL = "https://amc-satcom-engine.onrender.com";

// -------------------------------------------------------------
// 1️⃣ SATCOM HEALTH CHECK
// -------------------------------------------------------------
router.get("/health", async (req, res) => {
    try {
        const response = await axios.get(`${SATCOM_ENGINE_URL}/health`);

        return res.json({
            status: "ok",
            engine: "satcom-v2",
            telemetry: response.data
        });
    } catch (err) {
        console.error("SATCOM Health Error:", err.message);

        return res.status(500).json({
            status: "error",
            message: "SATCOM Engine health check failed",
            details: err.message
        });
    }
});

// -------------------------------------------------------------
// 2️⃣ SATCOM REASONING ENGINE v2
// -------------------------------------------------------------
router.post("/reason", async (req, res) => {
    try {
        const { message, module } = req.body;

        if (!message || !module) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: 'message' and 'module'"
            });
        }

        const response = await axios.post(`${SATCOM_ENGINE_URL}/reason`, {
            message,
            module
        });

        return res.json({
            status: "ok",
            engine: "satcom-v2",
            result: response.data
        });
    } catch (err) {

    console.error(
        "SATCOM Reasoning Error:",
        err.response?.status,
        err.response?.data || err.message
    );

    return res.status(500).json({
        status: "fatal-error",
        message: "SATCOM Reasoning Engine v2 failed",
        details: err.response?.data || err.message
    });
}

});  

// -------------------------------------------------------------
// 3️⃣ SATCOM INSIGHTS ENGINE v3
// -------------------------------------------------------------
router.post("/insights", async (req, res) => {
    try {
        const {
            vsatMetrics,
            leoMetrics,
            lbandMetrics,
            scenarioProfile,
            oemProfile,
            weather
        } = req.body;

        const response = await axios.post(`${SATCOM_ENGINE_URL}/insights`, {
            vsatMetrics,
            leoMetrics,
            lbandMetrics,
            scenarioProfile,
            oemProfile,
            weather
        });

        return res.json({
            status: "ok",
            engine: "satcom-v3-insights",
            insights: response.data
        });
    } catch (err) {
        console.error("SATCOM Insights Error:", err.message);

        return res.status(500).json({
            status: "fatal-error",
            message: "SATCOM Insights Engine v3 failed",
            details: err.message
        });
    }
});

export default router;

