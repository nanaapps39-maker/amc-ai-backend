// routes/satcomRoutes.js

import express from "express";
import axios from "axios";

const router = express.Router();

// SATCOM FastAPI Engine
const SATCOM_ENGINE_URL = "https://amc-satcom-engine.onrender.com";


// -------------------------------------------------------------
// 1. SATCOM HEALTH CHECK
// -------------------------------------------------------------
router.get("/health", async (req, res) => {
    try {
        const response = await axios.get(
            `${SATCOM_ENGINE_URL}/health`
        );

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
// 2. SATCOM REASONING ENGINE
// -------------------------------------------------------------
router.post("/reason", async (req, res) => {
    try {

        const { message, module } = req.body;

        if (!message || !module) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: message and module"
            });
        }

        console.log(
            "Calling SATCOM Reasoning:",
            `${SATCOM_ENGINE_URL}/reasoning`
        );

        const response = await axios.post(
            `${SATCOM_ENGINE_URL}/reasoning`,
            {
                message,
                module
            }
        );

        return res.json({
            status: "ok",
            engine: "satcom-v2",
            result: response.data
        });

        } catch (err) {
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("Message:", err.message);

        return res.status(500).json({
            status: "fatal-error",
            message: "SATCOM Reasoning Engine v2 failed",
            details: err.response?.data || err.message
        });
    }
});


// -------------------------------------------------------------
// 3. SATCOM INSIGHTS ENGINE
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

        const response = await axios.post(
            `${SATCOM_ENGINE_URL}/insights`,
            {
                vsatMetrics,
                leoMetrics,
                lbandMetrics,
                scenarioProfile,
                oemProfile,
                weather
            }
        );

        return res.json({
            status: "ok",
            engine: "satcom-v3-insights",
            insights: response.data
        });

    } catch (err) {

        console.error("SATCOM Insights Error");
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("Message:", err.message);

        return res.status(500).json({
            status: "fatal-error",
            message: "SATCOM Insights Engine v3 failed",
            details: err.response?.data || err.message
        });
    }
});

export default router;