// routes/chatRoute.js
import express from "express";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import { buildV31Response } from "../rendererMode.js";
import { MASTER_SYSTEM_PROMPT } from "../prompts/systemPrompts.js";
import {
    getVerifiedRouteFacts
} from "../maritimeFactsEngine.js";

import calculateLinkBudget
from "../linkBudget.js";

const router = express.Router();

// ======================================================
// MAIN CHAT ENDPOINT
// ======================================================
router.post("/", async (req, res) => {
    const rawMessage = req.body.message || "";

const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    // ======================================================
    // 1️⃣ SYSTEM COMMANDS — SATCOM ENGINE
    // ======================================================
    if (rawMessage.startsWith("/satcom-health")) {
        const response = await fetch("https://amc-ai-backend-1.onrender.com/satcom/health");
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }

    if (rawMessage.startsWith("/satcom-reason")) {
        const msg = rawMessage.replace("/satcom-reason ", "");
        const response = await fetch("https://amc-ai-backend-1.onrender.com/satcom/reason", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, module: "satcom" })
        });
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }

    if (rawMessage.startsWith("/satcom-insights")) {
        const payload = JSON.parse(rawMessage.replace("/satcom-insights ", ""));
        const response = await fetch("https://amc-ai-backend-1.onrender.com/satcom/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }

    // ======================================================
    // 2️⃣ SYSTEM COMMANDS — PORT INTELLIGENCE
    // ======================================================
    if (rawMessage.startsWith("/port ")) {
        const code = rawMessage.replace("/port ", "").trim();
        const response = await fetch(`https://amc-ai-backend-1.onrender.com/ports/code/${code}`);
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }

    if (rawMessage.startsWith("/ports-country ")) {
        const country = rawMessage.replace("/ports-country ", "").trim();
        const response = await fetch(`https://amc-ai-backend-1.onrender.com/ports/country/${country}`);
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }

    if (rawMessage.startsWith("/nearest-port ")) {
        const coords = rawMessage.replace("/nearest-port ", "").trim();
        const [lat, lon] = coords.split(",");
        const response = await fetch(
            `https://amc-ai-backend-1.onrender.com/ports/nearest?lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        return res.json({ payload: { reply: JSON.stringify(data, null, 2) } });
    }


// ======================================================
// 2️⃣ ROUTE INTELLIGENCE
// ======================================================
if (rawMessage.startsWith("/route ")) {

    const routeText = rawMessage.replace("/route ", "").trim();

    const [origin, destination] = routeText.split("/");

    const response = await fetch(
    `${req.protocol}://${req.get("host")}/ports/route/${origin.trim()}/${destination.trim()}`
);

    const data = await response.json();

    return res.json({
        payload: {
            reply: JSON.stringify(data, null, 2)
        }
    });
}


// ======================================================
// 2️⃣ NATURAL LANGUAGE ROUTING
// ======================================================

const routeMatch = rawMessage.match(
    /route from\s+([A-Z]{5})\s+to\s+([A-Z]{5})/i
);

if (routeMatch) {

    const origin = routeMatch[1].toUpperCase();
    const destination = routeMatch[2].toUpperCase();

    const response = await fetch(
        `${req.protocol}://${req.get("host")}/ports/route/${origin}/${destination}`
    );

    const data = await response.json();

    return res.json({
        payload: {
            reply: JSON.stringify(data, null, 2)
        }
    });
}

// ======================================================
// TRANSLATOR MODE
// ======================================================

if (
    rawMessage.toLowerCase().includes("translate") ||
    rawMessage.toLowerCase().includes("translation") ||
    rawMessage.toLowerCase().includes("translator mode")
) {

    const completion =
        await groq.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                {
                    role: "system",
                    content: `
You are AMC Academy Tech AI Translator Mode.

Your ONLY task is translation.

Always detect the requested target language.

Always translate the user's text into the specified target language.

Never return the original language unless the source language and target language are the same.

Preserve exactly:

VSAT
BUC
LNB
IF
NOC
GPS
AIS
ALM-102
ALM-305
ALM-501
dB
dBm
°C
NM
EIRP

Return ONLY the translated text.

Do not explain.
Do not analyse.
Do not answer questions.
Do not provide commentary.

Translation only.
`
                },
                {
                    role: "user",
                    content: rawMessage
                }
            ]
        });

    return res.json({
        payload: {
            reply: completion.choices[0].message.content
        }
    });
}
   
// ======================================================
// 3️⃣ NORMAL AI CHAT — GROQ MODEL
// ======================================================
try {

    let maritimeFacts = "";

    let satcomFacts = "";
    

    if (
        rawMessage.toLowerCase().includes("tema") &&
        rawMessage.toLowerCase().includes("singapore")
    ) {

        const facts =
            getVerifiedRouteFacts(
                "GHTEM",
                "SGSIN"
            );

        if (facts?.verified) {

            maritimeFacts = `
VERIFIED MARITIME FACTS

Origin:
${facts.origin.portName}, ${facts.origin.country}

Destination:
${facts.destination.portName}, ${facts.destination.country}

Distance:
${facts.distanceNm} NM

Bearing:
${facts.bearing}°

ETA:
${facts.eta.speed12kt} days @ 12 knots
${facts.eta.speed15kt} days @ 15 knots
${facts.eta.speed18kt} days @ 18 knots
`;
        }
    }


// ======================================================
// SATCOM LINK BUDGET ENGINE
// ======================================================

if (

    rawMessage.toLowerCase().includes("link budget") ||

    rawMessage.toLowerCase().includes("eirp") ||

    rawMessage.toLowerCase().includes("carrier to noise") ||

    rawMessage.toLowerCase().includes("c/n") ||

    rawMessage.toLowerCase().includes("link margin") ||

    rawMessage.toLowerCase().includes("satcom")

) {
    const budget =
        calculateLinkBudget({

            frequencyGHz: 14,

            txPower_dBW: 12,

            txAntennaGain_dBi: 41,

            rxAntennaGain_dBi: 41,

            pathLoss_dB: 206,

            rxSystemNoise_dBm: -95,

            elevationDeg: 20,

            rainRate_mm_per_h: 25
        });

    satcomFacts = `
VERIFIED SATCOM LINK BUDGET

IMPORTANT:
The following engineering calculations are authoritative.

Do NOT recalculate them.
Do NOT invent alternative values.
Do NOT override link margin calculations.
Do NOT override EIRP calculations.
Do NOT generate conflicting SATCOM metrics.

EIRP:
${budget.eirp_dBW} dBW

Atmospheric Loss:
${budget.atmLoss_dB} dB

Rain Fade:
${budget.rainFade_dB} dB

Total Path Loss:
${budget.totalPathLoss_dB} dB

Received Power:
${budget.receivedPower_dBm} dBm

Carrier to Noise:
${budget.cn_dB} dB

Link Margin:
${budget.linkMargin_dB} dB

Link Status:
${budget.linkStatus}

Survivability Score:
${budget.survivabilityScore}/100
`;

}



    const completion =
        await groq.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                {
                    role: "system",
                    content: MASTER_SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `

${maritimeFacts}

${satcomFacts}

USER REQUEST:

${rawMessage}

`
                }
            ]
        });

    const reply =
        completion.choices[0].message.content;

    return res.json(
        buildV31Response(
            "chat",
            { reply },
            1.0
        )
    );

} catch (err) {

    console.error(
        "CHAT ERROR:",
        err.message
    );

    return res.status(500).json(
        buildV31Response(
            "error",
            {
                message: "Chat backend failure",
                details: err.message
            },
            0.0
        )
    );
}

});

export default router;

