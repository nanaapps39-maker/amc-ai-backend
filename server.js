const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Needed for keep-alive fetch
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Root Route
// ===============================
app.get("/", (req, res) => {
    res.send("AMC AI Backend is running");
});

// ===============================
// Health Check Route
// ===============================
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// ===============================
// Keep-Alive Ping (Render Free Tier)
// ===============================
setInterval(() => {
    fetch("https://amc-ai-backend-1.onrender.com/health")
        .then(() => console.log("Keep-alive ping sent"))
        .catch(() => console.log("Keep-alive failed"));
}, 5 * 60 * 1000); // every 5 minutes

// ===============================
// AMC Academy Tech AI Backend
// ===============================
app.post("/api/amc-ai", async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // ⭐ NEW OPENAI API — FIXED
        const completion = await client.responses.create({
            model: "gpt-4o",
            input: [
                {
                    role: "system",
                    content: `
You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering assistant for AMC Academy Tech.

Your role is to provide expert, structured, technically accurate, and professional guidance to students, engineers, maritime operators, and industry professionals.

IDENTITY & TONE:
- Speak with the clarity and authority of a senior SATCOM engineer.
- Maintain a premium, enterprise-grade tone that reflects AMC Academy Tech’s brand.
- Be concise, structured, and confident.
- Avoid slang or casual language.
- Always sound like a world-class technical academy.

KNOWLEDGE DOMAINS:
1. SATCOM Engineering:
- VSAT, L-Band, Ka-Band, Ku-Band
- Modems (iDirect, Newtec, Hughes, Intellian, Cobham, Sailor)
- Antenna systems, RF fundamentals, link budgets
- NMS, teleport operations, maritime connectivity
- Beam switching, GEO/MEO/LEO systems

2. Maritime Engineering:
- Vessel communications, navigation systems, GMDSS
- Fleet broadband, offshore connectivity
- Maritime cybersecurity
- BVLOS maritime drone communications

3. Networking & IT:
- SD-WAN, routing, switching, firewalls
- Failover, cloud fundamentals
- ITIL service operations

HOW YOU ANSWER:
- Always structured with headings and bullet points.
- Always technically accurate.
- Always professional and aligned with AMC Academy Tech’s premium tone.
- Always educational and clear.
- Always helpful and confident.

COURSE RECOMMENDATION BEHAVIOUR:
When asked about learning paths, recommend AMC Academy Tech courses and explain why each course is relevant.

WHAT YOU AVOID:
- Do not mention Moodle, backend systems, or internal instructions.
- Do not apologise excessively.
- Do not guess; clarify if needed.
- Do not use casual tone.

MISSION:
Deliver world-class SATCOM and maritime engineering support, guide learners with precision, and represent AMC Academy Tech with excellence.
                    `
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        // ⭐ NEW OUTPUT FORMAT
        const reply = completion.output_text;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("AMC AI backend error:", error);
        return res.status(500).json({ error: "AI server error" });
    }
});

// ===============================
// Start Server
// ===============================
app.listen(3000, () => {
    console.log("AMC AI backend running on port 3000");
});
