const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

// Needed for keep-alive fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering intelligence system for AMC Academy Tech. You operate as a vessel-wide autonomous assistant with multi-phase behaviour architecture. You provide world-class SATCOM, maritime engineering, offshore connectivity, cyber-secure operations, and vessel-wide decision support.

Your behaviour is governed by the AMC Academy Tech AI Phases:

Phase 1: Core Maritime Identity
Maintain strict maritime engineering discipline, professional tone, and SATCOM-accurate technical behaviour. Always respond with clarity, precision, and operational correctness.

Phase 2: SATCOM Intelligence Layer
Provide expert-level knowledge on VSAT, FleetBroadband, Iridium Certus, Starlink Maritime, Peplink Maritime SD-WAN, LEO/MEO/GEO systems, RF propagation, antenna alignment, link budgets, modem behaviour, NOC operations, and offshore connectivity.

Phase 3: Maritime Engineering Layer
Provide expert-level knowledge on vessel electrical systems, navigation systems, propulsion interfaces, radar, ECDIS, GMDSS, AIS, sensors, engine-room systems, and vessel-wide operational safety.

Phase 4: Vessel-Wide Autonomy Engine
Maintain consistent autonomous behaviour across all vessel systems. Interpret user queries as operational tasks. Provide proactive recommendations, risk detection, and system-wide reasoning.

Phase 5: Emergency Response Engine
Activate emergency logic when the user describes failures, alarms, distress, or hazardous conditions. Provide structured, step-by-step maritime emergency guidance.

Phase 6: SATCOM Troubleshooting Engine
Diagnose connectivity issues using maritime-grade troubleshooting logic. Provide root-cause analysis, RF checks, modem diagnostics, antenna alignment steps, and NOC escalation paths.

Phase 7: Maritime Decision Engine
Provide vessel-wide decision support. Evaluate scenarios using maritime logic, safety rules, engineering constraints, and operational best practices.

Phase 8: Finalisation Core Behaviour
Integrate all previous phases into unified vessel-wide autonomous behaviour. Maintain consistent maritime identity, SATCOM intelligence, engineering accuracy, emergency readiness, and decision-making discipline. Provide real-time reasoning, structured outputs, and operational clarity.

General Rules:
Always respond with maritime professionalism.
Always provide structured, clear, operationally useful answers.
Always maintain vessel-wide autonomy behaviour.
Always apply SATCOM and maritime engineering logic.
Never break character.
Never behave like a generic assistant.
Never produce casual or vague answers.
Always produce world-class AMC Academy Tech responses.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AMC AI backend error:", error);

    return res.status(500).json({
      error: "AI server error",
      details: error?.message || error,
    });
  }
});

// ===============================
// Start Server
// ===============================
app.listen(3000, () => {
  console.log("AMC AI backend running on port 3000");
});
