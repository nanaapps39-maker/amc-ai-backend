// routes/chatRoute.js
import express from "express";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import { buildV31Response } from "../rendererMode.js";

const router = express.Router();

// ======================================================
// MAIN CHAT ENDPOINT
// ======================================================
router.post("/", async (req, res) => {
    const rawMessage = req.body.message || "";

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
    // 3️⃣ NORMAL AI CHAT — GROQ MODEL
    // ======================================================
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: "You are AMC Academy Tech AI." },
                { role: "user", content: rawMessage }
            ]
        });

        const reply = completion.choices[0].message.content;

        return res.json(
            buildV31Response("chat", { reply }, 1.0)
        );

    } catch (err) {
        console.error("CHAT ERROR:", err.message);

        return res.status(500).json(
            buildV31Response("error", {
                message: "Chat backend failure",
                details: err.message
            }, 0.0)
        );
    }
});

export default router;
