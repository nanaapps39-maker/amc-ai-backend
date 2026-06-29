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
// Keep-Alive Ping
// ===============================
setInterval(() => {
    fetch("https://amc-ai-backend-1.onrender.com/health")
        .then(() => console.log("Keep-alive ping sent"))
        .catch(() => console.log("Keep-alive failed"));
}, 5 * 60 * 1000);

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

        const completion = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering assistant for AMC Academy Tech.
                    `
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const reply = completion.choices[0].message.content;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("AMC AI backend error:", error);

        return res.status(500).json({
            error: "AI server error",
            details: error?.message || error
        });
    }
});

// ===============================
// Start Server
// ===============================
app.listen(3000, () => {
    console.log("AMC AI backend running on port 3000");
});
