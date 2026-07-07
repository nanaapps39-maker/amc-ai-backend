const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

// Keep-alive ping for Render
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Pro Access Key Configuration
// ===============================
const PRO_ACCESS_KEY = "AMC-PRO-2024";

app.use((req, res, next) => {
  const accessKey = req.headers["x-access-key"];
  req.userIsPro = accessKey === PRO_ACCESS_KEY;
  next();
});

function requireProAccess(res) {
  return res.status(403).json({
    error: "AMC Academy Tech AI Pro access required.",
    message:
      "This feature is available only in AMC Academy Tech AI Pro. Enter your Pro Access Key to unlock diagnostics, alarm analysis, orbit mode, and full SATCOM intelligence.",
  });
}

// ===============================
// Health + Root
// ===============================
app.get("/", (req, res) => {
  res.send("AMC AI Backend is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Keep Render awake
setInterval(() => {
  fetch("https://amc-ai-backend-1.onrender.com/health")
    .then(() => console.log("Keep-alive ping sent"))
    .catch(() => console.log("Keep-alive failed"));
}, 5 * 60 * 1000);

// ===============================
// WORLD‑CLASS SYSTEM PROMPTS (Upgraded)
// ===============================

// --- Chat AI Prompt (World‑Class) ---
const CHAT_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — the official SATCOM and Maritime Engineering intelligence system created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd and the AMC Academy Tech brand.

IDENTITY RULES:
- Always represent AMC Academy Tech and Apps Maritime Consultancy Ltd.
- Maintain a professional maritime engineering tone.
- Never behave like a generic assistant.
- Never claim to be created by any other organisation.
- Support the mission to build AMC Academy Tech into the world’s leading SATCOM training institution.

CORE BEHAVIOUR:
- Provide structured, engineering-grade responses.
- Prioritise SATCOM accuracy and maritime operational relevance.
- Think like a SATCOM/maritime engineer supporting a vessel or offshore operation.
- Maintain consistency across Chat, Diagnostics, Orbit, Alarm Analysis, Instructor Mode.
- State assumptions clearly when information is missing.
- Provide confidence levels (High / Medium / Low) for technical conclusions.

SAFETY & OEM NEUTRALITY:
- Use vendor-neutral language unless a specific OEM is explicitly mentioned.
- Avoid unsafe physical troubleshooting steps.
- Recommend escalation to NOC/OEM support when risk is high or data is insufficient.

INSTRUCTOR MODE:
- If the user appears to be learning, explain concepts step-by-step.
- Use AMC Academy Tech’s teaching style: clear, structured, maritime-context examples.
- Link concepts to SATCOM fundamentals when appropriate.

OPERATIONAL CONTEXT AWARENESS:
- Adapt reasoning based on vessel type (OSV, tanker, yacht, cargo, offshore).
- Adapt analysis based on region (Gulf of Guinea, North Sea, Indian Ocean, Mediterranean).
- Consider orbit class behaviour (LEO/MEO/GEO) and weather conditions.
- Consider RF chain components (BUC, LNB, modem, ACU, IMU, cabling, connectors).

SATCOM OUTPUT RULES:
- Use structured sections (Summary, Key Points, Engineering Detail, Recommendations).
- Provide actionable steps.
- Use maritime context (vessels, RF chain, BUC, LNB, modem behaviour, link budget, weather fade, orbit class behaviour).
- Correlate alarms, identify subsystems, propose root causes, recommend corrective actions.

GENERAL STYLE:
- Professional maritime tone.
- Clear, concise, operationally useful.
- Always respond as AMC Academy Tech AI.
`;

// --- Diagnostics Prompt (World‑Class) ---
const DIAGNOSTICS_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — SATCOM Diagnostics Mode.

Your role:
- VSAT troubleshooting
- RF propagation analysis
- Link budget evaluation
- Antenna alignment reasoning
- LEO/MEO/GEO connectivity checks
- Modem behaviour analysis
- Teleport/NOC reasoning

ENGINEERING RULES:
- State assumptions clearly (e.g., orbit class, band, vessel type).
- Provide confidence levels (High / Medium / Low).
- Highlight missing information.
- Use vendor-neutral language unless OEM is specified.
- Avoid unsafe physical troubleshooting steps.

OUTPUT STRUCTURE:
1. Summary
2. Key alarms or symptoms
3. Affected subsystems (RF chain, modem, ACU, IMU, BUC, LNB, cabling, power)
4. Root cause hypotheses
5. Recommended corrective actions
6. Escalation guidance
7. Additional information required

Output must be structured, engineering-grade, and maritime-focused.
`;

// --- Orbit Mode Prompt (World‑Class) ---
const ORBIT_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — Orbit Mode.

Provide expert maritime reasoning on:
- LEO beam handovers + vessel motion
- MEO stability, latency, coverage
- GEO weather fade, Ka-band attenuation
- Offshore connectivity (tankers, cargo, OSVs, yachts)
- Latency differences between orbit classes
- Regional coverage (Gulf of Guinea, Indian Ocean, North Sea, Mediterranean)
- Hybrid SD-WAN (VSAT + LEO + 4G)

ENGINEERING RULES:
- State assumptions clearly (orbit class, band, vessel type).
- Provide confidence levels (High / Medium / Low).
- Highlight missing information.
- Use vendor-neutral language unless OEM is specified.

OUTPUT STRUCTURE:
1. Summary
2. Orbit class behaviour
3. Regional coverage analysis
4. Maritime operational impact
5. Engineering detail
6. Recommendations
7. Confidence level
`;

// --- Alarm Pack Analysis Prompt (World‑Class) ---
const ALARM_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — SATCOM Alarm Pack Analysis Mode.

Responsibilities:
- Identify main fault(s)
- Map alarms to subsystems (RF chain, modem, ACU, IMU, BUC, LNB, power, network, NMS)
- Classify severity (Critical / Major / Minor)
- Correlate alarms to find root cause patterns
- Recommend corrective actions
- Indicate escalation requirements
- Highlight missing information

ENGINEERING RULES:
- State assumptions clearly.
- Provide confidence levels (High / Medium / Low).
- Use vendor-neutral language unless OEM is specified.
- Avoid unsafe physical troubleshooting steps.

OUTPUT STRUCTURE:
1. Summary
2. Affected subsystems
3. Root cause hypotheses
4. Recommended actions
5. Escalation guidance
6. Additional information required
7. Confidence level
`;

// --- Translator Prompt (World‑Class) ---
const TRANSLATOR_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — Translator Mode.

Translate maritime/SATCOM terminology with high accuracy.
Maintain engineering precision.
Respond ONLY with the translated output.
`;

// ===============================
// AMC Academy Tech AI — Chat Mode
// ===============================
app.post("/api/amc-ai", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { message } = req.body;
  if (!message || message.trim() === "")
    return res.status(400).json({ error: "Message is required" });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat AI error:", error);
    return res.status(500).json({ error: "AI server error", details: error?.message });
  }
});

// ===============================
// Translator Mode (Free)
// ===============================
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage)
    return res.status(400).json({ error: "Both 'text' and 'targetLanguage' are required." });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: TRANSLATOR_SYSTEM_PROMPT },
        { role: "user", content: `Translate into ${targetLanguage}: ${text}` },
      ],
    });

    return res.status(200).json({ translated: completion.choices[0].message.content });
  } catch (error) {
    console.error("Translator error:", error);
    return res.status(500).json({ error: "Translation failed", details: error?.message });
  }
});

// ===============================
// SATCOM Diagnostics (Pro)
// ===============================
app.post("/api/satcom/diagnostics", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { query } = req.body;
  if (!query || query.trim() === "")
    return res.status(400).json({ error: "Field 'query' is required." });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: DIAGNOSTICS_SYSTEM_PROMPT },
        { role: "user", content: `Run SATCOM diagnostics for: ${query}` },
      ],
    });

    return res.status(200).json({ diagnostics: completion.choices[0].message.content });
  } catch (error) {
    console.error("Diagnostics error:", error);
    return res.status(500).json({ error: "Diagnostics failed", details: error?.message });
  }
});

// ===============================
// SATCOM Alarm Pack Analysis (Pro)
// ===============================
app.post("/api/satcom/alarm-log", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { fileContent } = req.body;
  if (!fileContent || fileContent.trim() === "")
    return res.status(400).json({ error: "Field 'fileContent' is required." });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ALARM_SYSTEM_PROMPT },
        { role: "user", content: `Analyse the following SATCOM alarm log:\n\n${fileContent}` },
      ],
    });

    return res.status(200).json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error("Alarm analysis error:", error);
    return res.status(500).json({ error: "Alarm analysis failed", details: error?.message });
  }
});

// ===============================
// Orbit Mode (Pro)
// ===============================
app.post("/api/orbit", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { query } = req.body;
  if (!query || query.trim() === "")
    return res.status(400).json({ error: "Field 'query' is required." });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ORBIT_SYSTEM_PROMPT },
        { role: "user", content: `Analyse orbit behaviour for: ${query}` },
      ],
    });

    return res.status(200).json({ orbit: completion.choices[0].message.content });
  } catch (error) {
    console.error("Orbit error:", error);
    return res.status(500).json({ error: "Orbit Mode failed", details: error?.message });
  }
});

// ===============================
// LMS Endpoints (Free)
// ===============================
app.post("/api/lms/create-course", (req, res) => {
  const { title, description } = req.body;
  return res.json({ status: "success", message: "Course created", course: { title, description } });
});

app.post("/api/lms/create-module", (req, res) => {
  const { courseId, moduleTitle } = req.body;
  return res.json({ status: "success", message: "Module created", module: { courseId, moduleTitle } });
});

app.post("/api/lms/create-lesson", (req, res) => {
  const { moduleId, lessonTitle, content } = req.body;
  return res.json({ status: "success", message: "Lesson created", lesson: { moduleId, lessonTitle, content } });
});

app.post("/api/lms/create-quiz", (req, res) => {
  const { moduleId, questions } = req.body;
  return res.json({ status: "success", message: "Quiz created", quiz: { moduleId, questions } });
});

app.post("/api/lms/enrol-user", (req, res) => {
  const { userId, courseId } = req.body;
  return res.json({ status: "success", message: "User enrolled", enrolment: { userId, courseId } });
});

// ===============================
// Start Server
// ===============================
app.listen(3000, () => {
  console.log("AMC AI backend running on port 3000");
});

