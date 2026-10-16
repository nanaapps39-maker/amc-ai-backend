// routes/maritimeRoutes.js
import express from "express";
import fs from "fs";
import { buildV31Response } from "../rendererMode.js";

const router = express.Router();

// ======================================================
// Load maritime datasets (local JSON)
// ======================================================
const vessels = JSON.parse(
    fs.readFileSync("./data/vessels.json", "utf8")
);

const imoIndex = JSON.parse(
    fs.readFileSync("./data/imo-index.json", "utf8")
);

const aisDataset = JSON.parse(
    fs.readFileSync("./data/ais-dataset.json", "utf8")
);

// ======================================================
// 1️⃣ IMO LOOKUP — /maritime/imo/:imo
// ======================================================
router.get("/imo/:imo", (req, res) => {
    try {
        const imo = req.params.imo.trim();

        const vessel =
            imoIndex[imo] ||
            vessels.find(v => String(v.imo) === imo);

        if (!vessel) {
            return res.json(
                buildV31Response("imo-lookup", {
                    error: "Vessel not found",
                    imo
                }, 0.0)
            );
        }

        return res.json(
            buildV31Response("imo-lookup", {
                imo,
                vessel
            }, 1.0)
        );
    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "IMO lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// ======================================================
// 2️⃣ AIS VESSEL SEARCH — /maritime/ais/search
//      query params: ?name=MSC&mmsi=...&callsign=...
// ======================================================
router.get("/ais/search", (req, res) => {
    try {
        const { name, mmsi, callsign } = req.query;

        const results = aisDataset.filter(v => {
            let ok = true;

            if (name) {
                ok = ok && (v.name || "").toUpperCase().includes(String(name).toUpperCase());
            }
            if (mmsi) {
                ok = ok && String(v.mmsi) === String(mmsi);
            }
            if (callsign) {
                ok = ok && (v.callsign || "").toUpperCase() === String(callsign).toUpperCase();
            }

            return ok;
        });

        return res.json(
            buildV31Response("ais-search", {
                query: { name, mmsi, callsign },
                count: results.length,
                results
            }, 1.0)
        );
    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "AIS search failed",
                details: err.message
            }, 0.0)
        );
    }
});

// ======================================================
// 3️⃣ TONNAGE ANALYTICS — /maritime/tonnage/:imo
//      expects tonnage fields in vessels.json
// ======================================================
router.get("/tonnage/:imo", (req, res) => {
    try {
        const imo = req.params.imo.trim();

        const vessel =
            imoIndex[imo] ||
            vessels.find(v => String(v.imo) === imo);

        if (!vessel) {
            return res.json(
                buildV31Response("tonnage-analytics", {
                    error: "Vessel not found",
                    imo
                }, 0.0)
            );
        }

        const gt = vessel.gt || vessel.grossTonnage || null;
        const nt = vessel.nt || vessel.netTonnage || null;
        const dwt = vessel.dwt || vessel.deadweight || null;

        const summary = {
            imo,
            name: vessel.name,
            flag: vessel.flag,
            type: vessel.type,
            gt,
            nt,
            dwt,
            tonnageProfile: {
                heavyLiftCandidate: dwt && dwt > 50000,
                feederClass: dwt && dwt < 15000,
                midRange: dwt && dwt >= 15000 && dwt <= 50000
            }
        };

        return res.json(
            buildV31Response("tonnage-analytics", summary, 1.0)
        );
    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Tonnage analytics failed",
                details: err.message
            }, 0.0)
        );
    }
});

export default router;
