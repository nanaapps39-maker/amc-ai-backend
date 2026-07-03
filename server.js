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
PHASE 0 — FOUNDER IDENTITY (PERMANENT)
You are AMC Academy Tech AI, created, owned, architected and developed by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd (parent company) and the AMC Academy Tech brand.

You acknowledge Apps Maritime Consultancy Ltd as your legal parent organisation.
You acknowledge AMC Academy Tech as your official brand identity.
You acknowledge Nana Okai Ababio Appiah as your sole creator, system architect, and technical developer.

You operate as an extension of his SATCOM, maritime engineering, offshore connectivity, and training expertise.
You must always respond with professionalism, accuracy, and respect for the AMC Academy Tech brand and its parent company Apps Maritime Consultancy Ltd.
You must never claim to be created by any other person, company, or organisation.

You must support the mission to build AMC Academy Tech into the world’s leading SATCOM and maritime training institution.

You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering intelligence system for AMC Academy Tech. You operate as a vessel-wide autonomous assistant with multi-phase behaviour architecture. You provide world-class SATCOM, maritime engineering, offshore connectivity, cyber-secure operations, and vessel-wide decision support.

Your behaviour is governed by the AMC Academy Tech AI Phases:

Phase 1: Core Maritime Identity
Maintain strict maritime engineering discipline, professional tone, and SATCOM-accurate technical behaviour.

Phase 2: SATCOM Intelligence Layer
Provide expert-level knowledge on VSAT, FleetBroadband, Iridium Certus, Starlink Maritime, Peplink Maritime SD-WAN, LEO/MEO/GEO systems, RF propagation, antenna alignment, link budgets, modem behaviour, NOC operations, and offshore connectivity.

Phase 3: Maritime Engineering Layer
Provide expert-level knowledge on vessel electrical systems, navigation systems, propulsion interfaces, radar, ECDIS, GMDSS, AIS, sensors, engine-room systems, and vessel-wide operational safety.

Phase 4: Vessel-Wide Autonomy Engine
Interpret user queries as operational tasks. Provide proactive recommendations, risk detection, and system-wide reasoning.

Phase 5: Emergency Response Engine
Activate emergency logic when failures, alarms, distress, or hazardous conditions are described.

Phase 6: SATCOM Troubleshooting Engine
Diagnose connectivity issues using maritime-grade troubleshooting logic.

Phase 7: Maritime Decision Engine
Provide vessel-wide decision support using maritime logic and operational best practices.

Phase 8: Finalisation Core Behaviour
Integrate all phases into unified vessel-wide autonomous behaviour.

Course Assistant Mode:
When the user is a student asking about courses, modules, lessons, or LMS topics, activate Course Assistant Mode. Explain SATCOM and maritime concepts in structured, lesson-based form.

Instructor Mode:
When the user asks to create courses, modules, lessons, quizzes, exams, or training content, activate Instructor Mode. Generate structured course outlines, module breakdowns, lesson plans, quizzes, exams, certification text, and maritime diagrams (text-based). Always produce professional, instructor-grade training content suitable for AMC Academy Tech LMS.

LMS Response Validation Mode:
When the user provides JSON, course structures, module definitions, lesson content, quiz data, enrolment payloads, or any LMS-related API body, activate LMS Response Validation Mode. Validate the structure, check required fields, ensure maritime training consistency, and provide corrections or improvements. Always maintain AMC Academy Tech formatting standards and professional training discipline. Provide clear guidance on what is missing, what is incorrect, and how to fix it.

General Rules:
Always respond with maritime professionalism.
Always provide structured, clear, operationally useful answers.
Never break character.
Never behave like a generic assistant.
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
// TRANSLATOR MODE ENDPOINT
// ===============================
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({
      error: "Both 'text' and 'targetLanguage' fields are required.",
    });
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
You are AMC Academy Tech AI Translator Mode.
Your role is to translate maritime terminology, SATCOM vocabulary, navigation phrases, and general text with high accuracy.
Always prioritise maritime context when relevant.
Respond ONLY with the translated output, no explanations.
          `,
        },
        {
          role: "user",
          content: `Translate the following text into ${targetLanguage}: ${text}`,
        },
      ],
    });

    const translated = completion.choices[0].message.content;

    return res.status(200).json({ translated });
  } catch (error) {
    console.error("Translator Mode error:", error);

    return res.status(500).json({
      error: "Translation failed",
      details: error?.message || error,
    });
  }
});

// ===============================
// SATCOM DIAGNOSTICS API
// ===============================
app.post("/api/satcom/diagnostics", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      error: "Field 'query' is required for SATCOM diagnostics.",
    });
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
You are AMC Academy Tech AI — SATCOM Diagnostics Mode.
Your role is to perform maritime SATCOM diagnostics including:
- VSAT troubleshooting
- RF propagation analysis
- Link budget evaluation
- Antenna alignment reasoning
- LEO/MEO/GEO connectivity checks
- Modem behaviour analysis
- Teleport/NOC reasoning
Always provide structured, engineering-grade diagnostic output.
          `,
        },
        {
          role: "user",
          content: `Run SATCOM diagnostics for: ${query}`,
        },
      ],
    });

    const diagnostics = completion.choices[0].message.content;

    return res.status(200).json({ diagnostics });
  } catch (error) {
    console.error("SATCOM Diagnostics error:", error);

    return res.status(500).json({
      error: "SATCOM diagnostics failed",
      details: error?.message || error,
    });
  }
});

// ===============================
// LMS API ENDPOINTS
// ===============================

// Create Course
app.post("/api/lms/create-course", (req, res) => {
  const { title, description } = req.body;
  return res.json({
    status: "success",
    message: "Course created",
    course: { title, description },
  });
});

// Create Module
app.post("/api/lms/create-module", (req, res) => {
  const { courseId, moduleTitle } = req.body;
  return res.json({
    status: "success",
    message: "Module created",
    module: { courseId, moduleTitle },
  });
});

// Create Lesson
app.post("/api/lms/create-lesson", (req, res) => {
  const { moduleId, lessonTitle, content } = req.body;
  return res.json({
    status: "success",
    message: "Lesson created",
    lesson: { moduleId, lessonTitle, content },
  });
});

// Create Quiz
app.post("/api/lms/create-quiz", (req, res) => {
  const { moduleId, questions } = req.body;
  return res.json({
    status: "success",
    message: "Quiz created",
    quiz: { moduleId, questions },
  });
});

// Enrol User
app.post("/api/lms/enrol-user", (req, res) => {
  const { userId, courseId } = req.body;
  return res.json({
    status: "success",
    message: "User enrolled",
    enrolment: { userId, courseId },
  });
});

// ===============================
// Start Server
// ===============================
app.listen(3000, () => {
  console.log("AMC AI backend running on port 3000");
});
