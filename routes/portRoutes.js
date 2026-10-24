// routes/portRoutes.js
import express from "express";
import { buildV31Response } from "../rendererMode.js";
import fs from "fs";

const router = express.Router();

// Load world ports database
const worldPorts = JSON.parse(
    fs.readFileSync("./data/worldPorts.json", "utf8")
);

// -------------------------------------------------------------
// 1️⃣ GET PORT BY UN/LOCODE
// -------------------------------------------------------------
router.get("/code/:unlocode", (req, res) => {
    try {
        const code = req.params.unlocode.toUpperCase();
        const port = worldPorts.find(p => p.unlocode === code);

        if (!port) {
            return res.json(
                buildV31Response("port-lookup", {
                    error: "Port not found",
                    unlocode: code
                }, 0.0)
            );
        }

        return res.json(
            buildV31Response("port-lookup", {
                unlocode: code,
                port
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Port lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// -------------------------------------------------------------
// 2️⃣ SEARCH PORTS BY COUNTRY CODE
// -------------------------------------------------------------
router.get("/country/:country", (req, res) => {
    try {
        const country = req.params.country.toUpperCase();

        const ports = worldPorts.filter(
            p => (p.country || "").toUpperCase() === country
        );

        return res.json(
            buildV31Response("ports-by-country", {
                country,
                count: ports.length,
                ports
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Country lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// -------------------------------------------------------------
// 3️⃣ FILTER PORTS BY SUBDIVISION (ADMIN AREA)
// -------------------------------------------------------------
router.get("/subdivision/:code", (req, res) => {
    try {
        const subdivision = req.params.code.toUpperCase();

        const ports = worldPorts.filter(
            p => (p.subdivision || "").toUpperCase() === subdivision
        );

        return res.json(
            buildV31Response("ports-by-subdivision", {
                subdivision,
                count: ports.length,
                ports
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Subdivision lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// -------------------------------------------------------------
// 4️⃣ REGION GROUPING (AFRICA, EUROPE, ASIA, AMERICAS, MIDDLE EAST)
// -------------------------------------------------------------
function mapCountryToRegion(countryCode) {
    const c = countryCode.toUpperCase();

    const africa = ["GH", "NG", "GA", "ZA", "KE", "TZ", "CM", "CI"];
    const europe = ["GB", "FR", "DE", "ES", "IT", "NL", "NO", "SE", "DK", "AD"];
    const middleEast = ["AE", "SA", "OM", "QA", "KW", "BH", "IR", "IQ"];
    const asia = ["CN", "JP", "KR", "SG", "IN", "MY", "TH", "ID", "PH"];
    const americas = ["US", "CA", "BR", "AR", "MX", "CL", "PE", "CO"];

    if (africa.includes(c)) return "AFRICA";
    if (europe.includes(c)) return "EUROPE";
    if (middleEast.includes(c)) return "MIDDLE_EAST";
    if (asia.includes(c)) return "ASIA";
    if (americas.includes(c)) return "AMERICAS";
    return "OTHER";
}

router.get("/region/:region", (req, res) => {
    try {
        const regionReq = req.params.region.toUpperCase();

        const ports = worldPorts.filter(
            p => mapCountryToRegion(p.country) === regionReq
        );

        return res.json(
            buildV31Response("ports-by-region", {
                region: regionReq,
                count: ports.length,
                ports
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Region lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});

// -------------------------------------------------------------
// 5️⃣ NEAREST PORT TO COORDINATES (Haversine)
// -------------------------------------------------------------
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

router.get("/nearest", (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return res.json(
                buildV31Response("nearest-port", {
                    error: "Invalid coordinates"
                }, 0.0)
            );
        }

        let nearest = null;
        let minDist = Infinity;

        for (const p of worldPorts) {
            const d = haversine(lat, lon, p.lat, p.lon);
            if (d < minDist) {
                minDist = d;
                nearest = p;
            }
        }

        return res.json(
            buildV31Response("nearest-port", {
                input: { lat, lon },
                nearest,
                distanceKm: minDist
            }, 1.0)
        );

    } catch (err) {
        return res.status(500).json(
            buildV31Response("error", {
                message: "Nearest port lookup failed",
                details: err.message
            }, 0.0)
        );
    }
});


export default router;
