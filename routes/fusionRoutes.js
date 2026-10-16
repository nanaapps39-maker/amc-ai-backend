// routes/fusionRoutes.js
import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import { buildV31Response } from "../rendererMode.js";

const router = express.Router();

// ======================================================
// Load datasets (local JSON)
// ======================================================
const worldPorts = JSON.parse(
    fs.readFileSync("./data/worldPorts.json", "utf8")
);

const vessels = JSON.parse(
    fs.readFileSync("./data/vessels.json", "utf8")
);

const aisDataset = JSON.parse(
    fs.readFileSync("./data/ais-dataset.json", "utf8")
);

// ======================================================
// Utility: Haversine distance
// ======================================================
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ======================================================
// 1️⃣ FUSION LOOKUP — Vessel + AIS + Nearest Port
//     /fusion/vessel/:imo
// ======================================================
router.get("/vessel/:imo", (req, res) => {
    try {
        const imo = req.params.imo.trim();

        // Vessel metadata
        const vessel = vessels.find(v => String(v.imo) === imo);

        if (!vessel) {
            return res.json(
                buildV31Response("fusion-vessel", {
                    error: "Vessel not found",
                    imo
                }, 0.0)
            );
        }

        // AIS match
        const ais = aisDataset.find(a => String(a.imo) === imo);

        // Nearest port (if AIS has coordinates)
        let nearestPort = null;
        let minDist = Infinity;

        if (ais && ais.lat && ais.lon) {
            for (const p of worldPorts) {
                const d = haversine(ais.lat, ais.lon, p.lat, p.lon);
                if (d < minDist) {
                    minDist = d;
                    nearestPort = p;
                }
            }
        }

        return res.json(
            buildV31Response("fusion-vessel", {
                imo,
                vessel,
                ais,
                nearestPort,
                distanceKm: nearestPort ? minDist : null
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Fusion vessel lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// ======================================================
// 2️⃣ FUSION ROUTE — AIS + Port + Voyage Estimation
//     /fusion/route?imo=9319466&dest=GBLON
// ======================================================
router.get("/route", (req, res) => {
    try {
        const { imo, dest } = req.query;

        if (!imo || !dest) {
            return res.json(
                buildV31Response("fusion-route", {
                    error: "Missing imo or dest"
                }, 0.0)
            );
        }

        const vessel = vessels.find(v => String(v.imo) === String(imo));
        const ais = aisDataset.find(a => String(a.imo) === String(imo));
        const port = worldPorts.find(p => p.unlocode === dest.toUpperCase());

        if (!vessel || !ais || !port) {
            return res.json(
                buildV31Response("fusion-route", {
                    error: "Vessel, AIS, or destination port not found",
                    imo,
                    dest
                }, 0.0)
            );
        }

        // Distance to destination
        const distanceKm = haversine(ais.lat, ais.lon, port.lat, port.lon);

        // Basic ETA (speed in knots → convert to km/h)
        const speedKnots = ais.speed || 12;
        const speedKmH = speedKnots * 1.852;
        const etaHours = distanceKm / speedKmH;

        return res.json(
            buildV31Response("fusion-route", {
                imo,
                vessel,
                ais,
                destination: port,
                distanceKm,
                etaHours
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Fusion route calculation failed",
                details: err.message
            }, 0.0)
        );
    }
});

// ======================================================
// 3️⃣ FUSION SUMMARY — AIS + Port Region + Tonnage Profile
//     /fusion/summary/:imo
// ======================================================
router.get("/summary/:imo", (req, res) => {
    try {
        const imo = req.params.imo.trim();

        const vessel = vessels.find(v => String(v.imo) === imo);
        const ais = aisDataset.find(a => String(a.imo) === imo);

        if (!vessel) {
            return res.json(
                buildV31Response("fusion-summary", {
                    error: "Vessel not found",
                    imo
                }, 0.0)
            );
        }

        // Tonnage profile
        const gt = vessel.gt || vessel.grossTonnage || null;
        const nt = vessel.nt || vessel.netTonnage || null;
        const dwt = vessel.dwt || vessel.deadweight || null;

        const tonnageProfile = {
            heavyLiftCandidate: dwt && dwt > 50000,
            feederClass: dwt && dwt < 15000,
            midRange: dwt && dwt >= 15000 && dwt <= 50000
        };

        // Region (based on AIS → nearest port)
        let region = "UNKNOWN";

        if (ais && ais.lat && ais.lon) {
            let nearest = null;
            let minDist = Infinity;

            for (const p of worldPorts) {
                const d = haversine(ais.lat, ais.lon, p.lat, p.lon);
                if (d < minDist) {
                    minDist = d;
                    nearest = p;
                }
            }

            if (nearest && nearest.region) {
                region = nearest.region;
            }
        }

        return res.json(
            buildV31Response("fusion-summary", {
                imo,
                vessel,
                ais,
                tonnageProfile,
                region
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Fusion summary failed",
                details: err.message
            }, 0.0)
        );
    }
});

export default router;
