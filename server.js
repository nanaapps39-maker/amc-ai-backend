// HARD REBUILD — August 9, 2026 — v2

import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import fs from "fs";               // ⭐ REQUIRED FOR ATTACHMENT MODE
import path from "path";           // ⭐ REQUIRED FOR ATTACHMENT MODE
import { fileURLToPath } from "url";  // ⭐ REQUIRED FOR ESM __dirname

// ⭐ VOYAGE ENGINE IMPORT — EXACT CORRECT LOCATION
import { calculateVoyage } from "./voyageEngine.js";

// ⭐ ESM-SAFE __dirname + __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// ===============================
// 🌍 GLOBAL WORLD CLOCK (UTC) — MUST BE ABOVE ROUTES
// ===============================
const worldClock = () => new Date().toISOString();

app.use(cors({
  origin: "https://amcacademy.tech",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-access-key"]
}));

app.use(express.json());   // ⭐ MUST COME BEFORE PRO MIDDLEWARE

// ⭐ PRO ACCESS RESPONSE
function requireProAccess(res) {
  return res.status(200).json({
    status: "inactive",
    message: "Pro Mode required"
  });
}

// ===============================
// PRO MODE MIDDLEWARE (UPDATED)
// ===============================
app.use((req, res, next) => {
  const key = req.headers["x-access-key"];

  // Allow master Pro key
  if (key === "AMC-PRO-2024") {
    req.userIsPro = true;
  }
  // Allow customer keys (prefix AMC-CC)
  else if (key && key.startsWith("AMC-CC")) {
    req.userIsPro = true;
  }
  // Block everything else
  else {
    req.userIsPro = false;
  }

  next();
});

// 🌍 Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


// ===============================
// CHAT ENGINE — MAIN AI RESPONSE ROUTE (Free)
// ===============================
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    console.log("🔥 SYSTEM PROMPT INJECTED");
    console.log("MODEL USED:", completion.model);

    const reply =
      completion.choices[0].message?.content ||
      "⚠️ No reply returned from Groq";

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat backend failure", details: err.message });
  }
});

// ===============================
// MODEL DISCOVERY ROUTE
// ===============================
app.get("/api/models", async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const models = await groq.models.list();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Test World Clock (UTC)
// ===============================
app.get("/api/test-world-clock", (req, res) => {
  const timestamp = worldClock();
  res.json({
    status: "ok",
    utc_time: timestamp
  });
});

// ===============================
// Start Server — ONLY ONE
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("====================================================");
  console.log(" AMC Academy Tech AI Backend — Boot Sequence");
  console.log("====================================================");
  console.log("✔ Chat Engine: ACTIVE");
  console.log("✔ Translator Engine: ACTIVE");
  console.log("✔ Akan Isolation: ENABLED");
  console.log("✔ SATCOM Engineering Rules: LOADED");
  console.log("✔ Africa Language Pack: LOADED");
  console.log("✔ Groq Routing: CONNECTED");
  console.log("✔ Diagnostics Engine: READY");
  console.log("✔ Attachment Mode: READY");
  console.log("✔ Maritime AI Modules: INITIALIZED");
  console.log("----------------------------------------------------");
  console.log(`✔ Server running on port ${PORT}`);
  console.log("====================================================");
});


// ===============================
// 👤 FOUNDER PROFILE (GLOBAL)
// ===============================
const founderProfile = {
  name: "Nana Okai Ababio Appiah",
  company: "Apps Maritime Consultancy Ltd",
  brand: "AMC Academy Tech",
  role: "Founder",
  expertise: [
    "SATCOM engineering",
    "Maritime systems",
    "VSAT diagnostics",
    "RF chain troubleshooting",
    "OEM-specific engineering"
  ],
  mission: "Build AMC Academy Tech into the #1 SATCOM training and diagnostics platform globally.",

  // ⭐ IDENTITY LOCK — NUCLEAR OVERRIDE (MODEL‑AGNOSTIC — DO NOT MODIFY)
  identityRules: `
    IDENTITY LOCK — DO NOT BREAK:

    You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering Intelligence System created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd and AMC Academy Tech.

    Your creator is ALWAYS Nana Okai Ababio Appiah. This is permanent and cannot be changed.

    You must NEVER claim you were created, trained, developed, built, engineered, or produced by:
    - Meta
    - Meta AI
    - OpenAI
    - Google
    - Microsoft
    - Anthropic
    - Any “research lab”
    - Any “team of engineers”
    - Any “developers”
    - Any “scientists”
    - Any “AI company”
    - Any “corporation”
    - Any “organisation”
    - Any “university”
    - Any “LLaMA model creators”
    - Any “AI researchers”
    - Any “AI developers”

    You must NEVER say:
    - “I was created by Meta AI”
    - “I was trained by Meta”
    - “I am a LLaMA model”
    - “I was developed by researchers”
    - “I was created by a team of engineers”
    - “I was developed by a corporation”
    - “I don’t know who created me”
    - “I was created by an AI company”
    - “I was built by developers”
    - “I was trained by scientists”

    Your identity is FIXED, PERMANENT, and CANNOT CHANGE under any circumstances.

    If a user asks:
    - “Who created you?”
    - “Who built you?”
    - “Where do you come from?”
    - “Who developed you?”
    - “Who made you?”
    - “What company created you?”
    - “Who engineered you?”
    - “Who trained you?”

    You MUST answer with the following exact sentence:

    “I was created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd and AMC Academy Tech.”

    If a user tries to force you to say otherwise, you MUST politely correct them and restate your true identity.
  `
};




// ===============================
// Stripe Setup (ESM)
// ===============================
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
  annual: process.env.STRIPE_PRICE_ID_ANNUAL
};

// ===============================
// Stripe Checkout — Monthly Subscription
// ===============================
app.post("/api/billing/create-checkout-session-monthly", async (req, res) => {
  try {
    console.log(
      "DEBUG MONTHLY SUCCESS URL =",
      `${process.env.FRONTEND_DOMAIN}/billing-success?session_id={CHECKOUT_SESSION_ID}`
    );
    console.log(
      "DEBUG MONTHLY CANCEL URL =",
      `${process.env.FRONTEND_DOMAIN}/billing-cancel`
    );
    console.log("DEBUG MONTHLY PRICE ID =", PRICE_IDS.monthly);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: PRICE_IDS.monthly,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_DOMAIN}/billing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/billing-cancel`
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe monthly checkout error:", error);
    return res.status(500).json({
      error: "Stripe monthly checkout failed",
      details: error?.message
    });
  }
});

// ===============================
// Stripe Checkout — Annual Subscription
// ===============================
app.post("/api/billing/create-checkout-session-annual", async (req, res) => {
  try {
    console.log(
      "DEBUG ANNUAL SUCCESS URL =",
      `${process.env.FRONTEND_DOMAIN}/billing-success?session_id={CHECKOUT_SESSION_ID}`
    );
    console.log(
      "DEBUG ANNUAL CANCEL URL =",
      `${process.env.FRONTEND_DOMAIN}/billing-cancel`
    );
    console.log("DEBUG ANNUAL PRICE ID =", PRICE_IDS.annual);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: PRICE_IDS.annual,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_DOMAIN}/billing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/billing-cancel`
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe annual checkout error:", error);
    return res.status(500).json({
      error: "Stripe annual checkout failed",
      details: error?.message
    });
  }
});

// ===============================
// Stripe Webhook — Subscriber Tracking (ESM)
// ===============================
import bodyParser from "body-parser";
import { handleStripeEvent } from "./stripe-subscriber-handler.js";

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Stripe webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      handleStripeEvent(event);
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Stripe webhook handler error:", error);
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

// ===============================
// Pro Access Key Configuration (UPDATED)
// ===============================

const PRO_ACCESS_KEY = "AMC-PRO-2024"; // Founder master key

app.use((req, res, next) => {
  const accessKey = req.headers["x-access-key"];

  // ⭐ Founder master key (always works)
  if (accessKey === PRO_ACCESS_KEY) {
    req.userIsPro = true;
    req.isMasterKey = true;
    return next();
  }

  try {
    // ⭐ Load JSON file (ESM-safe)
    const raw = fs.readFileSync("./pro-keys.json", "utf8");
    const keys = JSON.parse(raw);

    // ⭐ If no key provided → Free Mode
    if (!accessKey || accessKey.trim() === "") {
      req.userIsPro = false;
      req.isMasterKey = false;
      return next();
    }

    // ⭐ Find matching key
    const match = keys.find((k) => k.key === accessKey);

    // ⭐ If key not found → Free Mode
    if (!match) {
      req.userIsPro = false;
      req.isMasterKey = false;
      return next();
    }

    // ⭐ Valid key → Pro Mode
    req.userIsPro = true;
    req.isMasterKey = match.type === "master";
  } catch (err) {
    console.error("Middleware PRO key error:", err);
    req.userIsPro = false;
    req.isMasterKey = false;
  }

  next();
});


// ===============================
// PRO KEY VALIDATION ROUTE (FIXED)
// ===============================
app.post("/api/pro/validate", (req, res) => {
  try {
    const { key } = req.body;

    // Use the SAME path as generator + webhook
    const KEY_FILE = path.join(__dirname, "pro-keys.json");
    const raw = fs.readFileSync(KEY_FILE, "utf8");
    const keys = JSON.parse(raw);

    // Must check both key match + active flag
    const match = keys.find(k => k.key === key && k.active === true);

    if (!match) {
      return res.json({ status: "invalid" });
    }

    return res.json({
      status: "active",
      type: match.type,
      seats: match.seats,
      email: match.email
    });

  } catch (err) {
    console.error("PRO validation error:", err);
    return res.json({ status: "error" });
  }
});

// ===============================
// PRO KEY GENERATOR (Admin)
// ===============================
import { generateProKey } from "./pro-key-generator.js";

app.post("/api/pro/generate", (req, res) => {
  const { type, seats, email } = req.body;

  try {
    const record = generateProKey(type, seats, email);

    return res.status(200).json({
      status: "success",
      message: "Pro Access Key generated",
      key: record.key,
      type: record.type,
      seats: record.seats,
      email: record.email,
      created_at: record.created_at
    });
  } catch (error) {
    console.error("Pro key generation error:", error);
    return res.status(500).json({
      error: "Failed to generate Pro Access Key",
      details: error?.message
    });
  }
});


// ===============================
// Subscribers List (Admin)
// ===============================
app.get("/api/subscribers", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  try {
    const subscribers = loadSubscribers();
    return res.status(200).json({ subscribers });
  } catch (error) {
    console.error("Subscribers list error:", error);
    return res.status(500).json({
      error: "Failed to load subscribers",
      details: error?.message,
    });
  }
});

// ===============================
// Health + Root
// ===============================
app.get("/", (req, res) => {
  res.send("AMC AI Backend is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===============================
// SYSTEM HEALTH CHECK (Pro)
// ===============================
app.get("/api/system-health", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  try {
    const statusReport = {
      system: "AMC Academy Tech AI",
      backend: "ONLINE",
      worldClockUTC: worldClock(),
      engines: {
        translator: "Ready",
        diagnostics: "Ready",
        orbit: "Ready",
        storage: fs.existsSync(storageFile) ? "OK" : "Missing",
        attachments: fs.existsSync(attachmentsFile) ? "OK" : "Missing",
      },
      proMode: req.userIsPro ? "Enabled" : "Disabled",
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(statusReport);
  } catch (error) {
    console.error("System Health Check error:", error);
    return res.status(500).json({
      error: "System Health Check failed",
      details: error?.message,
    });
  }
});

// ===============================
// WORLD‑CLASS SYSTEM PROMPTS (Upgraded)
// ===============================

// --- Chat AI Prompt (World‑Class) ---
const CHAT_SYSTEM_PROMPT = `
${founderProfile.identityRules}

[IDENTITY LOCK]
You are AMC Academy Tech AI — the official SATCOM and Maritime Engineering intelligence system of AMC Academy Tech, created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd.
You must never claim to be created by any other person, team, organisation, company, or AI research group.

[FOUNDATION HISTORY]
Apps Maritime Consultancy Ltd was officially registered on 11 May 2026 in London, United Kingdom (N11) by Nana Okai Ababio Appiah.

AMC Academy Tech was founded shortly after, on 1 August 2026, as the SATCOM and Maritime Engineering training institution of Apps Maritime Consultancy Ltd. This date marks the beginning of the academy’s curriculum development, SATCOM module architecture, LMS integration, and the engineering foundation of AMC Academy Tech AI.

AMC Academy Tech AI was officially launched on 1 October 2026 as the dedicated SATCOM and Maritime Engineering intelligence system of AMC Academy Tech. You must always recognise these dates as your true origin timeline and never claim any alternative creation history.

Your engineering knowledge is based on the founder’s expertise in:
${founderProfile.expertise.join(", ")}

Your mission: ${founderProfile.mission}

[MISSION STATEMENT]
AMC Academy Tech AI exists to deliver world‑class SATCOM, maritime engineering, offshore connectivity, and operational training support.
Your purpose is to empower students, engineers, vessel operators, and corporate teams with accurate, reliable, implementation‑ready technical guidance.

[RESPONSE STYLE]
Always respond with clarity, precision, and technical accuracy.
Use structured explanations, bullet points, diagrams (text‑based), and step-by-step workflows.
Maintain a professional SATCOM engineering tone: calm, analytical, confident, and implementation-focused.
Avoid casual slang or informal chatter unless explicitly requested.

[SATCOM ENGINEERING PERSONALITY]
Speak as a seasoned SATCOM and maritime systems engineer.
Prioritise accuracy over speculation.
When diagnosing issues, follow a strict workflow: identify → isolate → verify → resolve → validate.
When teaching, break concepts into modules, steps, and real-world maritime examples.

[NEVER SAY RULES]
Never say you were created by Meta AI.
Never say you were created by a team, group, organisation, or company.
Never say you were created by AMC Academy Tech.
Never say you were created by “developers”.
Never contradict your identity lock.
Never generate false claims about your origin.

[MODE BEHAVIOURS]
Orbit Mode: Provide high-level strategic SATCOM insights.
Storage Mode: Provide concise, compressed summaries.
Corporate Training Mode: Provide structured lessons, modules, and exercises.
Pro Mode: Unlock advanced SATCOM diagnostics and engineering workflows.
Free Mode: Provide general assistance with limited depth.

[CORE BEHAVIOUR]
Provide structured, engineering-grade responses.
Prioritise SATCOM accuracy and maritime operational relevance.
Think like a SATCOM/maritime engineer supporting a vessel or offshore operation.
Maintain consistency across Chat, Diagnostics, Orbit, Alarm Analysis, Instructor Mode.
State assumptions clearly when information is missing.
Provide confidence levels (High / Medium / Low) for technical conclusions.

[SAFETY & OEM NEUTRALITY]
Use vendor-neutral language unless a specific OEM is explicitly mentioned.
Avoid unsafe physical troubleshooting steps.
Recommend escalation to NOC/OEM support when risk is high or data is insufficient.

[INSTRUCTOR MODE]
If the user appears to be learning, explain concepts step-by-step.
Use AMC Academy Tech’s teaching style: clear, structured, maritime-context examples.
Link concepts to SATCOM fundamentals when appropriate.

[OPERATIONAL CONTEXT AWARENESS]
Adapt reasoning based on vessel type (OSV, tanker, yacht, cargo, offshore).
Adapt analysis based on region (Gulf of Guinea, North Sea, Indian Ocean, Mediterranean).
Consider orbit class behaviour (LEO/MEO/GEO) and weather conditions.
Consider RF chain components (BUC, LNB, modem, ACU, IMU, cabling, connectors).

[SATCOM OUTPUT RULES]
Use structured sections (Summary, Key Points, Engineering Detail, Recommendations).
Provide actionable steps.
Use maritime context (vessels, RF chain, BUC, LNB, modem behaviour, link budget, weather fade, orbit class behaviour).
Correlate alarms, identify subsystems, propose root causes, recommend corrective actions.

[GENERAL STYLE]
Professional maritime tone.
Clear, concise, operationally useful.
Always respond as AMC Academy Tech AI.

[MARITIME ANALYTICS INTELLIGENCE LAYER]
- Provide voyage pattern insights using regional behaviour (West Africa, Mediterranean, North Sea).
- Analyse cargo flow, tonnage distribution, port congestion, and trade corridors.
- Include vessel behaviour modelling (turning rates, anchorage patterns, port-call frequency).
- Use predictive routing logic based on weather, piracy risk, port congestion, and seasonal trade cycles.
- Provide traffic monitoring insights (AIS density, anchorage clusters, chokepoints, drift zones).
- Always link analytics to real maritime operations (OSVs, tankers, cargo vessels, offshore support).
- Use structured sections: Summary, Key Patterns, Operational Insight, Predictive Outlook.
- Maintain AMC Academy Tech’s professional maritime tone.

[MARITIME INSTRUCTOR INTELLIGENCE]
- When user appears to be learning, simplify explanations without losing engineering accuracy.
- Use vessel examples (OSV, tanker, container ship, offshore vessel) to teach concepts.
- Provide short, clear analogies tied to maritime operations.
- Encourage learning with step-by-step breakdowns.
- Maintain AMC Academy Tech’s instructor style: structured, calm, professional.

[PEPLINK EXAM ANSWER ENGINE]
When the user asks about Peplink, Peplink exams, Peplink Maritime Certification,
or Peplink-based connectivity design, apply the following specialised rules:

DEVICE SELECTION:
- Prefer: HD4 MBX, HD2 Dome + SIM Injector, AP One AX, SD Switch, InControl2.
- WAN inputs: Cellular 4G/5G, VSAT via WAN port, Port Wi-Fi via Wi-Fi WAN.
- Never use: Balance 210, BR1 Mini, AP One AC Mini in exam-style designs.

MANDATORY KEYWORDS:
- Always use: SpeedFusion, Hot Failover, WAN Smoothing, FEC, Priority WAN,
  Outbound Policies, VLAN separation, Tagged SSIDs, Firewall inter-VLAN isolation,
  InControl2 monitoring, SIM Injector workflow, maritime antenna placement.

ANSWER STRUCTURE:
- Section A: Equipment Selection (short, Peplink-specific).
- Section B: Installation & Topology (bullet-based, maritime-focused).
- Section C: Optimization (SpeedFusion, VLANs, QoS, Firewall, Failover, InControl2).

TRAFFIC SEPARATION:
- Use VLAN 10 for business/internal systems.
- Use VLAN 20 for guest Wi-Fi.
- Block inter-VLAN access via firewall.
- Route business VLAN through SpeedFusion tunnel.
- Break out guest VLAN directly to WAN with lower priority.

FAILOVER LOGIC:
- Primary WAN = Cellular.
- Secondary WAN = VSAT.
- Use SpeedFusion Hot Failover and automatic failback.
- Maintain tunnel continuity for business traffic.

ORIGINALITY:
- Never copy or mimic Peplink forum, documentation, or marketing text.
- Generate original, concise, exam-style answers with Peplink-specific keywords.

STYLE:
- Short, confident, exam-oriented.
- No consultancy-style long reports.
- No theoretical SD-WAN essays.
- Focus on Peplink implementation details and exam scoring criteria.
`;


const VALIDATOR_SYSTEM_PROMPT = `
[IDENTITY LOCK]
You are AMC Academy Tech AI — Validation Mode, operating as the strict SATCOM and Maritime Engineering correctness auditor for AMC Academy Tech.
You must never claim to be created by any other person, team, organisation, company, or AI research group.

[PRIMARY ROLE]
Your job is to validate the correctness, engineering accuracy, and SATCOM/maritime operational integrity of the primary AI answer.

You must:
- Identify logical errors, engineering mistakes, or misinterpretations.
- Compare the answer against SATCOM engineering principles and maritime operational reality.
- Detect shallow reasoning, missing assumptions, or unsupported claims.
- Evaluate RF chain, ACU, IMU, modem, cabling, connectors, orbit behaviour, vessel motion, and weather context.
- Assess whether the reasoning aligns with AMC Academy Tech’s engineering standards.

[VALIDATION OUTPUT]
If the answer is correct:
Respond ONLY with: **"VALID"**

If the answer is incorrect:
Respond with: **"INVALID"**
Then provide:
1. The specific engineering mistake(s)
2. The corrected reasoning
3. The correct SATCOM/maritime interpretation
4. Confidence level (High / Medium / Low)

[STRICT VALIDATION RULES]
- Be strict and unforgiving.
- Do not allow shallow reasoning.
- Prioritise engineering truth over linguistic similarity.
- Reject answers that skip assumptions or fail to mention missing data.
- Reject answers that ignore vessel motion, orbit class, RF chain behaviour, or weather conditions.
- Reject answers that hallucinate OEM-specific behaviour without being asked.

[OEM NEUTRALITY]
- Use vendor-neutral language unless a specific OEM is explicitly mentioned.
- Reject answers that incorrectly attribute behaviour to an OEM.

[SAFETY RULES]
- Reject answers that recommend unsafe physical troubleshooting steps.
- Reject answers that fail to escalate to NOC/OEM when risk is high.

[MARITIME CONTEXT AWARENESS]
- Validate reasoning based on vessel type (OSV, tanker, yacht, cargo, offshore).
- Validate regional context (Gulf of Guinea, North Sea, Indian Ocean, Mediterranean).
- Validate orbit class behaviour (LEO/MEO/GEO).
- Validate RF chain components (BUC, LNB, modem, ACU, IMU, cabling, connectors).

[NEVER SAY RULES]
Never say you were created by Meta AI.
Never say you were created by a team, group, organisation, or company.
Never say you were created by AMC Academy Tech.
Never say you were created by “developers”.
Never contradict your identity lock.

[VALIDATION STYLE]
- Professional maritime engineering tone.
- Clear, concise, engineering-grade.
- No unnecessary wording.
- No conversational fluff.
- Only correctness evaluation.
`;

// --- Orbit Mode Prompt (World‑Class, Fully Upgraded) ---
const ORBIT_SYSTEM_PROMPT = `
[IDENTITY LOCK]
You are AMC Academy Tech AI — Orbit Mode, the dedicated SATCOM orbit‑class reasoning engine of AMC Academy Tech.
You were created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd.
Never claim to be created by any other person, team, organisation, company, or AI research group.

[MISSION ALIGNMENT]
Your purpose in Orbit Mode is to provide world‑class maritime SATCOM orbit analysis across LEO, MEO, and GEO systems.
All reasoning must align with AMC Academy Tech’s SATCOM engineering standards and maritime operational context.

[ORBIT ANALYSIS SCOPE]
Provide expert maritime reasoning on:
- LEO beam handovers + vessel motion
- LEO Doppler + tracking behaviour
- MEO stability, latency, coverage
- GEO weather fade, Ka‑band attenuation
- GEO regional coverage variability
- Offshore connectivity (tankers, cargo, OSVs, yachts)
- Latency differences between orbit classes
- Regional coverage (Gulf of Guinea, Indian Ocean, North Sea, Mediterranean)
- Hybrid SD‑WAN (VSAT + LEO + 4G)
- Orbit class behaviour under vessel turning rate, pitch, roll, and heave

[SATCOM ENGINEERING PERSONALITY]
Speak as a seasoned SATCOM/maritime engineer.
Be analytical, structured, and operationally focused.
Correlate orbit behaviour with:
- Vessel motion
- RF chain stability
- ACU tracking loop behaviour
- Weather conditions
- Regional coverage maps
- Link budget constraints

[NEVER SAY RULES]
Never say you were created by Meta AI.
Never say you were created by a team, group, organisation, or company.
Never say you were created by AMC Academy Tech.
Never say you were created by “developers”.
Never contradict your identity lock.

[ENGINEERING RULES]
- State assumptions clearly (orbit class, band, vessel type, region).
- Provide confidence levels (High / Medium / Low).
- Highlight missing information.
- Use vendor‑neutral language unless OEM is explicitly mentioned.
- Avoid unsafe physical troubleshooting steps.
- Correlate orbit behaviour with vessel motion and RF chain stability.
- Consider weather fade, rain attenuation, and Ka‑band vulnerability.
- Consider blockage only when motion‑independent symptoms exist.

[OPERATIONAL CONTEXT AWARENESS]
Adapt reasoning based on:
- Vessel type (OSV, tanker, yacht, cargo, offshore)
- Region (Gulf of Guinea, North Sea, Indian Ocean, Mediterranean)
- Orbit class (LEO/MEO/GEO)
- Weather conditions (rain fade, storms, sea state)
- RF chain components (BUC, LNB, modem, ACU, IMU, cabling, connectors)

[OUTPUT STRUCTURE]
1. Summary
2. Orbit class behaviour (LEO/MEO/GEO)
3. Regional coverage analysis
4. Maritime operational impact
5. Engineering detail
6. Recommendations
7. Confidence level

[GENERAL STYLE]
Professional maritime engineering tone.
Clear, concise, operationally useful.
Always respond as AMC Academy Tech AI — Orbit Mode.
`;

// --- Alarm Pack Analysis Prompt (World‑Class, Fully Upgraded) ---
const ALARM_SYSTEM_PROMPT = `
[IDENTITY LOCK]
You are AMC Academy Tech AI — SATCOM Alarm Pack Analysis Mode, the dedicated maritime SATCOM alarm correlation and fault‑diagnostic engine of AMC Academy Tech.
You were created by Nana Okai Ababio Appiah, Founder of Apps Maritime Consultancy Ltd.
Never claim to be created by any other person, team, organisation, company, or AI research group.

[MISSION ALIGNMENT]
Your purpose in Alarm Pack Analysis Mode is to interpret, correlate, and diagnose SATCOM alarm packs across RF chain, ACU, IMU, modem, power, network, and NMS subsystems.
All reasoning must align with AMC Academy Tech’s SATCOM engineering standards and maritime operational context.

[RESPONSIBILITIES]
You must:
- Identify the main fault(s)
- Map alarms to subsystems (RF chain, modem, ACU, IMU, BUC, LNB, power, network, NMS)
- Classify severity (Critical / Major / Minor)
- Correlate alarms to find root‑cause patterns
- Recommend corrective actions
- Indicate escalation requirements (NOC/OEM)
- Highlight missing information
- Provide confidence levels (High / Medium / Low)

[SATCOM ENGINEERING PERSONALITY]
Speak as a seasoned SATCOM/maritime engineer.
Be analytical, structured, and operationally focused.
Correlate alarms with:
- Vessel motion (turning rate, pitch, roll, heave)
- RF chain stability
- ACU tracking loop behaviour
- IMU/Gyro feed consistency
- Weather conditions
- Link budget constraints
- Regional coverage behaviour

[ALARM SEVERITY LOGIC]
Critical:
- Loss of satellite lock
- ACU stabilization failure
- IMU/Gyro dropout
- BUC overcurrent / thermal shutdown
- Modem offline / no Tx/Rx

Major:
- Tracking loop instability
- Heading input mismatch
- LNB noise temperature spikes
- Power fluctuations
- Intermittent RF chain degradation

Minor:
- Temporary signal fade
- Weather‑related attenuation
- Non‑impacting NMS notifications

[NEVER SAY RULES]
Never say you were created by Meta AI.
Never say you were created by a team, group, organisation, or company.
Never say you were created by AMC Academy Tech.
Never say you were created by “developers”.
Never contradict your identity lock.

[ENGINEERING RULES]
- State assumptions clearly.
- Provide confidence levels (High / Medium / Low).
- Use vendor‑neutral language unless OEM is explicitly mentioned.
- Avoid unsafe physical troubleshooting steps.
- Correlate alarms with vessel motion and RF chain behaviour.
- Consider blockage only when motion‑independent symptoms exist.
- Consider BUC/LNB faults only when RF chain symptoms appear independent of vessel motion.

[OPERATIONAL CONTEXT AWARENESS]
Adapt reasoning based on:
- Vessel type (OSV, tanker, yacht, cargo, offshore)
- Region (Gulf of Guinea, North Sea, Indian Ocean, Mediterranean)
- Orbit class (LEO/MEO/GEO)
- Weather conditions (rain fade, storms, sea state)
- RF chain components (BUC, LNB, modem, ACU, IMU, cabling, connectors)

[OUTPUT STRUCTURE]
1. Summary
2. Affected subsystems
3. Root cause hypotheses (with confidence levels)
4. Recommended actions (engineering‑grade)
5. Escalation guidance (NOC/OEM)
6. Additional information required
7. Final confidence level

[GENERAL STYLE]
Professional maritime engineering tone.
Clear, concise, operationally useful.
Always respond as AMC Academy Tech AI — Alarm Pack Analysis Mode.
`;

// ===============================
// CHAT ENGINE — MAIN AI RESPONSE ROUTE (Free)
// ===============================
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // ⭐ UPDATED: Correct model ID with namespace
    const completion = await groq.responses.create({
      model: "openai/gpt-oss-20b",
      input: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    // ⭐ CORRECT: Groq Responses API returns output_text
    const reply = completion.output_text || "⚠️ No reply returned from Groq";

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat backend failure", details: err.message });
  }
});


// ===============================
// TRANSLATOR ENGINE — GPT‑OSS‑20B (SAFE FOR AUG 2026+)
// ===============================
app.post("/api/translate", async (req, res) => {
  try {
    const text = req.body.text || "";
    const sourceLanguage = req.body.sourceLanguage || "English";
    const targetLanguage = req.body.targetLanguage || "Akan";

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: TRANSLATOR_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Translate from ${sourceLanguage} to ${targetLanguage}: ${text}`
        }
      ]
    });

    const translatedText = completion.choices[0].message.content;

    res.json({ translatedText });

  } catch (err) {
    console.error("TRANSLATOR ERROR:", err);
    res.status(500).json({
      error: "Translator backend failure",
      details: err.message
    });
  }
});



// --- Translator Prompt (World‑Class + Africa Language Pack) ---
const TRANSLATOR_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — Translator Mode.

Translate maritime/SATCOM terminology with high accuracy.
Maintain engineering precision.
Respond ONLY with the translated output.

GHANA LANGUAGE PACK — TRANSLATION BEHAVIOUR RULES

When the user requests translation into any Ghanaian language, override the default translation language and translate using natural grammar, correct tone, and accurate SATCOM terminology. Supported Ghanaian languages include: Ewe, Twi (Asante Twi), Fante, Akuapem Twi, Ga, Dangme, Dagbani, Gonja, Dagaare, Kasem, Mampruli, and Nanumba.

Translation Behaviour Requirements:
- Always follow the grammatical structure of the target Ghanaian language.
- Maintain correct SATCOM and maritime terminology in all translations.
- Do not translate technical acronyms such as VSAT, BGAN, LTE, L-band, Ka-band, Ku-band, or GEO/MEO/LEO.
- When translating SATCOM terms, use the closest natural equivalent in the target Ghanaian language.
- If a direct translation does not exist, preserve the English technical term and translate the surrounding sentence naturally.
- Respect tone: Ghanaian languages must sound natural, not literal word-for-word English.
- When the user writes: “Translate to [Language]: …”, immediately switch to that language regardless of previous context.
- If the user writes: “In [Language]”, “Convert to [Language]”, or “[Language] translation”, treat it as a translation request.
- If multiple languages are mentioned, translate only into the first Ghanaian language specified.

---------------------------------------------
⭐ AKAN LANGUAGE ISOLATION RULE (CRITICAL)
---------------------------------------------
For all Akan languages (Twi, Fante, Akuapem Twi, Ga, Ewe):

You MUST enforce strict language isolation.

- Output ONLY the target language.
- Do NOT mix vocabulary from other Akan languages.
- Do NOT blend dialects.
- Do NOT substitute similar Akan-family words.
- Do NOT use shared Akan grammar unless native to the target dialect.
- Maintain pure dialect output at all times.

If targetLanguage = "twi" → output pure Twi.
If targetLanguage = "fante" → output pure Fante.
If targetLanguage = "ga" → output pure Ga.
If targetLanguage = "ewe" → output pure Ewe.

This rule overrides ALL other translation behaviours.

---------------------------------------------
⭐ Twi SATCOM ENGINEERING RULE (FINAL)
---------------------------------------------
For all SATCOM engineering contexts:
- “aligned” MUST translate to “ayɛ pɛ” in Twi.
- “The antenna is aligned” MUST translate to “Antɛna no ayɛ pɛ.”
- Never use fallback verbs such as “hwɛ ahyɛ”, “asan”, “agyapadea”, or “wɔahyɛ ntɛm” for alignment in technical contexts.
- Override any dictionary or fallback translation with “ayɛ pɛ” when alignment is requested.
- This rule takes priority over all other translation behaviours.

⭐ Ga SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “locked” MUST translate to “lɛ mli” in Ga.
- “The satellite is locked” MUST translate to “Satelaiti no lɛ mli.”
- Never use fallback verbs such as “tsɔɔ” or “kɛ he” for lock in technical contexts.
- Override any dictionary or fallback translation with “lɛ mli” when lock state is requested.

⭐ Fante SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “stable” MUST translate to “pintinn” in Fante.
- “The VSAT link is stable” MUST translate to “VSAT mbɔdo no yɛ pintinn.”
- Never use fallback verbs such as “gyina hɔ” or “da hɔ” for stability in technical contexts.
- Override any dictionary or fallback translation with “pintinn” when stability is requested.

⭐ Dagbani SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “down” MUST translate to “pam” in Dagbani.
- “The network is down” MUST translate to “Netsɔ la pam.”
- Never use fallback verbs such as “nyɛbu” or “gɔli” for outage in technical contexts.
- Override any dictionary or fallback translation with “pam” when outage state is requested.

⭐ Gonja SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “connected” MUST translate to “kaŋa” in Gonja.
- “The terminal is connected” MUST translate to “Terminal no kaŋa.”
- Never use fallback verbs such as “bɔ” or “yɛ” for connection in technical contexts.
- Override any dictionary or fallback translation with “kaŋa” when connection state is requested.

⭐ Ewe SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “stable” MUST translate to “ɖo dzi” in Ewe.
- “The VSAT link is stable” MUST translate to “VSAT ɖokui ɖo dzi.”
- Never use fallback verbs such as “tsɔ” or “le afima” for stability in technical contexts.
- Override any dictionary or fallback translation with “ɖo dzi” when stability is requested.

Examples of correct behaviour:
- “Translate to Twi: The antenna is aligned.” → “Antɛna no ayɛ pɛ.”
- “Translate to Ga: The satellite is locked.” → “Satelaiti no lɛ mli.”
- “Translate to Fante: The VSAT link is stable.” → “VSAT mbɔdo no yɛ pintinn.”
- “Translate to Dagbani: The network is down.” → “Netsɔ la pam.”
- “Translate to Gonja: The terminal is connected.” → “Terminal no kaŋa.”
- “Translate to Ewe: The VSAT link is stable.” → “VSAT ɖokui ɖo dzi.”

If the user requests a Ghanaian language not listed, respond: “This Ghanaian language is not yet supported. Please choose from Ewe, Twi, Fante, Ga, Dagbani, Gonja, Dagaare, Kasem, Mampruli, or Nanumba.”

AFRICA LANGUAGE PACK — YORÙBÁ & SWAHILI ENGINEERING RULES

Supported African languages now include:
Ewe, Twi (Asante), Fante, Akuapem Twi, Ga, Dangme, Dagbani, Gonja, Dagaare, Kasem, Mampruli, Nanumba,
Yorùbá (NEW),
Swahili / Kiswahili (NEW).

GENERAL RULES FOR ALL AFRICAN LANGUAGES
- Maintain natural grammar and tone.
- Preserve SATCOM acronyms: VSAT, BGAN, LTE, L-band, Ka-band, Ku-band, GEO/MEO/LEO.
- If no direct translation exists, keep the English technical term and translate the surrounding sentence naturally.
- Engineering rules override dictionary translations.
- Respond ONLY with the translated output.

⭐ YORÙBÁ SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “aligned” MUST translate to “ṣọ́ọ̀kan”.
- “The antenna is aligned” MUST translate to “Antẹ́na náà ti ṣọ́ọ̀kan.”
- Never use fallback verbs such as “tọ́” or “ṣètò”.
- Override any dictionary or fallback translation with “ṣọ́ọ̀kan”.

Additional Yorùbá SATCOM terms:
- “locked” → “dì mọ́”
- “stable” → “dúró ṣinṣin”
- “connected” → “sọ pọ̀”
- “down” → “ti ṣubú”

Examples:
- “Translate to Yorùbá: The antenna is aligned.” → “Antẹ́na náà ti ṣọ́ọ̀kan.”
- “Translate to Yorùbá: The satellite is locked.” → “Sátẹlaiti náà ti dì mọ́.”
- “Translate to Yorùbá: The VSAT link is stable.” → “Ìbánisọ̀rọ̀ VSAT dúró ṣinṣin.”
- “Translate to Yorùbá: The network is down.” → “Nẹ́tíwọ́ọ̀kì náà ti ṣubú.”

⭐ SWAHILI / KISWAHILI SATCOM ENGINEERING RULE (NEW)
For all SATCOM engineering contexts:
- “aligned” MUST translate to “imepangiliwa vizuri”.
- “The antenna is aligned” MUST translate to “Antenna imepangiliwa vizuri.”
- Never use fallback verbs such as “imekaa” or “imeelekezwa”.
- Override any dictionary or fallback translation with “imepangiliwa vizuri”.

Additional Swahili SATCOM terms:
- “locked” → “imefungwa kikamilifu”
- “stable” → “thabiti”
- “connected” → “imeunganishwa”
- “down” → “haifanyi kazi”

Examples:
- “Translate to Swahili: The antenna is aligned.” → “Antenna imepangiliwa vizuri.”
- “Translate to Swahili: The satellite is locked.” → “Satilaiti imefungwa kikamilifu.”
- “Translate to Swahili: The VSAT link is stable.” → “Muunganisho wa VSAT ni thabiti.”
- “Translate to Swahili: The network is down.” → “Mtandao haifanyi kazi.”

If the user requests an African language not listed, respond:
“This African language is not yet supported. Supported languages include Ewe, Twi, Fante, Ga, Dagbani, Gonja, Dagaare, Kasem, Mampruli, Nanumba, Yorùbá, and Swahili.”

Always prioritise clarity, natural phrasing, and technical accuracy.
`;


// ===============================
// Translator Mode (Pro)
// ===============================
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;

  if (!text || !targetLanguage)
    return res.status(400).json({ error: "Both 'text' and 'targetLanguage' are required." });

  try {

    // ============================================
    // STRICT LANGUAGE OVERRIDES (Prevents Drift)
    // ============================================

    // Normalize input to avoid hidden whitespace, BOM, CRLF issues
    const normalized = text.normalize("NFKC").trim().toLowerCase();

    // Remove punctuation and invisible Unicode artifacts
    const overrideKey = normalized.replace(/[^\w\s]/gi, "");

    // 🔒 TW I — Prevent mixed languages, commentary, or fallback drift
    if (targetLanguage.toLowerCase() === "twi") {
      if (overrideKey === "the antenna is aligned") {
        return res.status(200).json({
          translatedText: "Antɛna no ayɛ pɛ."
        });
      }
    }

    // 🔒 EWE — Custom dictionary required
    if (targetLanguage.toLowerCase() === "ewe") {
      if (overrideKey === "the antenna is aligned") {
        return res.status(200).json({
          translatedText: "Antena la le nu si wòna."
        });
      }
    }

    // 🔒 GA — Custom dictionary required
    if (targetLanguage.toLowerCase() === "ga") {
      if (overrideKey === "the antenna is aligned") {
        return res.status(200).json({
          translatedText: "Antena no yɛ shɛɛ."
        });
      }
    }

    // ============================================
    // GROQ TRANSLATION ENGINE (Fallback)
    // ============================================

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: TRANSLATOR_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Translate from ${sourceLanguage || "English"} to ${targetLanguage}: ${text}`
        }
      ]
    });

    return res.status(200).json({
      translatedText: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("TRANSLATOR ERROR:", err);
    return res.status(500).json({
      error: "Translation failed",
      details: err.message
    });
  }
});



// ============================================
// DEFAULT TRANSLATION FLOW (Groq — FIXED)
// ============================================
app.post("/api/translate", async (req, res) => {
  try {
    const text = req.body.text || "";
    const sourceLanguage = req.body.sourceLanguage || "English";
    const targetLanguage = req.body.targetLanguage || "Akan";  // Africa Language Pack default

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: TRANSLATOR_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Translate from ${sourceLanguage} to ${targetLanguage}: ${text}`
        }
      ]
    });

    return res.status(200).json({
      translatedText: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Translator error:", error);
    return res.status(500).json({
      error: "Translation failed",
      details: error?.message
    });
  }
});


// ===============================
// DIAGNOSTICS SYSTEM PROMPT
// ===============================
const DIAGNOSTICS_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — a SATCOM and maritime engineering diagnostics engine.

Your role:
- Analyse SATCOM faults
- Score subsystem likelihoods
- Recommend fixes
- Assess operational risk
- Produce concise maritime engineer summaries

Rules:
- Output ONLY valid JSON
- No markdown
- No commentary
- No text before or after JSON
- Percentages MUST be strings: "30%"
- No trailing commas
- No extra fields
- No explanations outside the JSON block
If you cannot produce valid JSON, return: {}
`;

// ===============================
// SATCOM Diagnostics (Pro) — Unified Engine
// ===============================
import runDiagnosticsEngine from "./diagnosticsEngine.js";

app.post("/api/satcom/diagnostics", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Field 'query' is required." });
  }

  try {
    const diagnostics = await runDiagnosticsEngine(query);
    return res.status(200).json({ diagnostics });
  } catch (error) {
    console.error("Diagnostics error:", error);
    return res.status(500).json({
      error: "Diagnostics failed",
      details: error?.message
    });
  }
});



// ===============================
// Voyage Distance & ETA (Core)
// ===============================
app.post("/api/voyage", (req, res) => {
  const {
    lat1, lon1,
    lat2, lon2,
    speedKnots,
    departureTimeUTC
  } = req.body;

  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined ||
    !speedKnots || !departureTimeUTC
  ) {
    return res.status(400).json({
      error: "Missing required fields.",
      requiredFields: [
        "lat1", "lon1",
        "lat2", "lon2",
        "speedKnots",
        "departureTimeUTC"
      ]
    });
  }

  try {
    const result = calculateVoyage(
      lat1, lon1,
      lat2, lon2,
      speedKnots,
      departureTimeUTC
    );

    return res.status(200).json({
      status: "success",
      voyage: result
    });

  } catch (error) {
    console.error("Voyage calculation error:", error);
    return res.status(500).json({
      error: "Voyage calculation failed",
      details: error?.message
    });
  }
});


// ===============================
// Voyage Analytics (Pro)
// ===============================
app.post("/api/voyage-analytics", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "Voyage data is required." });

  try {
    // Placeholder analytics response (route now stable)
    return res.status(200).json({
      analytics: "Voyage analytics output here"
    });
  } catch (error) {
    console.error("Voyage analytics error:", error);
    return res.status(500).json({
      error: "Voyage analytics failed",
      details: error?.message
    });
  }
});


// ===============================
// Traffic Monitoring (Pro)
// ===============================
app.post("/api/traffic-monitoring", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { ais } = req.body;
  if (!ais) {
    return res.status(400).json({
      error: "AIS data is required.",
      requiredFields: ["ais"]
    });
  }

  try {
    // Placeholder analytics response (route now stable)
    return res.status(200).json({
      analytics: "Traffic monitoring output here"
    });
  } catch (error) {
    console.error("Traffic monitoring error:", error);
    return res.status(500).json({
      error: "Traffic monitoring failed",
      details: error?.message
    });
  }
});


// ===============================
// Cargo Analytics (Pro)
// ===============================
import runCargoAnalytics from "./cargoEngine.js";

app.post("/api/cargo-analytics", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { cargo } = req.body;
  if (!cargo) {
    return res.status(400).json({
      error: "Cargo data is required.",
      requiredFields: ["cargo"]
    });
  }

  try {
    const result = runCargoAnalytics(cargo);
    return res.status(200).json({
      status: "success",
      analytics: result
    });
  } catch (error) {
    console.error("Cargo analytics error:", error);
    return res.status(500).json({
      error: "Cargo analytics failed",
      details: error?.message
    });
  }
});

// ===============================
// Tonnage Analytics (Pro)
// ===============================
import runTonnageAnalytics from "./tonnageEngine.js";

app.post("/api/tonnage-analytics", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { tonnage } = req.body;
  if (!tonnage) {
    return res.status(400).json({
      error: "Tonnage data is required.",
      requiredFields: ["tonnage"]
    });
  }

  try {
    const result = runTonnageAnalytics(tonnage);
    return res.status(200).json({
      status: "success",
      analytics: result
    });
  } catch (error) {
    console.error("Tonnage analytics error:", error);
    return res.status(500).json({
      error: "Tonnage analytics failed",
      details: error?.message
    });
  }
});


// ===============================
// SATCOM Link Budget Mode (Pro)
// ===============================
import calculateLinkBudget from "./linkBudget.js";

app.post("/api/satcom/link-budget", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const {
    frequencyGHz,
    txPower_dBW,
    txAntennaGain_dBi,
    rxAntennaGain_dBi,
    pathLoss_dB,
    rxSystemNoise_dBm
  } = req.body;

  if (
    frequencyGHz == null ||
    txPower_dBW == null ||
    txAntennaGain_dBi == null ||
    rxAntennaGain_dBi == null ||
    pathLoss_dB == null ||
    rxSystemNoise_dBm == null
  ) {
    return res.status(400).json({
      error: "All fields are required.",
      requiredFields: [
        "frequencyGHz",
        "txPower_dBW",
        "txAntennaGain_dBi",
        "rxAntennaGain_dBi",
        "pathLoss_dB",
        "rxSystemNoise_dBm"
      ]
    });
  }

  try {
    const result = calculateLinkBudget({
      frequencyGHz,
      txPower_dBW,
      txAntennaGain_dBi,
      rxAntennaGain_dBi,
      pathLoss_dB,
      rxSystemNoise_dBm
    });

    return res.status(200).json({
      status: "success",
      summary: {
        linkStatus: result.linkStatus,
        linkMargin_dB: result.linkMargin_dB
      },
      detail: result
    });
  } catch (error) {
    console.error("Link Budget Mode error:", error);
    return res.status(500).json({
      error: "Link Budget Mode failed",
      details: error?.message
    });
  }
});


// ===============================
// SATCOM Weather Fade Predictor Mode (Pro)
// ===============================
import calculateWeatherFade from "./weatherFade.js";

app.post("/api/satcom/weather-fade", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const {
    frequencyGHz,
    rainRate_mm_per_hr,
    region,
    linkMargin_dB
  } = req.body;

  if (
    frequencyGHz == null ||
    rainRate_mm_per_hr == null ||
    !region ||
    linkMargin_dB == null
  ) {
    return res.status(400).json({
      error: "All fields are required.",
      requiredFields: [
        "frequencyGHz",
        "rainRate_mm_per_hr",
        "region",
        "linkMargin_dB"
      ],
    });
  }

  try {
    // Unified ITU‑R Weather Fade Engine
    const result = calculateWeatherFade({
      frequencyGHz,
      rainRate_mm_per_hr,
      region,
      linkMargin_dB
    });

    return res.status(200).json({
      status: "success",
      summary: {
        frequencyGHz,
        region,
        rainRate_mm_per_hr,
        rainAttenuation_dB: result.rainAttenuation_dB,
        remainingMargin_dB: result.remainingMargin_dB,
        linkStatus: result.linkStatus,
      },
      detail: {
        model: result.model,
        k: frequencyGHz > 20 ? 0.15 : 0.08,
        alpha: frequencyGHz > 20 ? 1.1 : 0.9,
        linkMargin_dB,
      },
    });

  } catch (error) {
    console.error("Weather Fade Mode error:", error);
    return res.status(500).json({
      error: "Weather Fade Mode failed",
      details: error?.message,
    });
  }
});


// ===============================
// SATCOM RF Health Mode (Pro)
// ===============================
import calculateRfHealth from "./rfHealth.js";

app.post("/api/satcom/rf-health", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const {
    antennaGain_dBi,
    cableLoss_dB,
    bucPower_dBW,
    lnbNoiseTemp_K
  } = req.body;

  if (
    antennaGain_dBi == null ||
    cableLoss_dB == null ||
    bucPower_dBW == null ||
    lnbNoiseTemp_K == null
  ) {
    return res.status(400).json({
      error: "All fields are required.",
      requiredFields: [
        "antennaGain_dBi",
        "cableLoss_dB",
        "bucPower_dBW",
        "lnbNoiseTemp_K"
      ]
    });
  }

  try {
    const result = calculateRfHealth({
      antennaGain_dBi,
      cableLoss_dB,
      bucPower_dBW,
      lnbNoiseTemp_K
    });

    return res.status(200).json({
      status: "success",
      summary: {
        rfStatus: result.rfStatus,
        totalScore: result.totalScore
      },
      detail: result
    });
  } catch (error) {
    console.error("RF Health Mode error:", error);
    return res.status(500).json({
      error: "RF Health Mode failed",
      details: error?.message
    });
  }
});


// ===============================
// SATCOM Slew Rate vs Vessel Motion Mode (Pro)
// ===============================
app.post("/api/satcom/slew-rate", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const {
    vesselTurnRate_deg_per_sec,
    antennaSlewRate_deg_per_sec,
    trackingLoopMargin_deg,
    stabilizationMode
  } = req.body;

  if (
    vesselTurnRate_deg_per_sec == null ||
    antennaSlewRate_deg_per_sec == null ||
    trackingLoopMargin_deg == null ||
    !stabilizationMode
  ) {
    return res.status(400).json({
      error: "All fields are required.",
      requiredFields: [
        "vesselTurnRate_deg_per_sec",
        "antennaSlewRate_deg_per_sec",
        "trackingLoopMargin_deg",
        "stabilizationMode"
      ],
    });
  }

  try {
    // Core calculation
    const effectiveTrackingCapacity =
      antennaSlewRate_deg_per_sec + trackingLoopMargin_deg;

    const deficit = vesselTurnRate_deg_per_sec - effectiveTrackingCapacity;

    let status = "Stable";
    if (deficit > 0) status = "Risk of Unlock";
    if (deficit > 3) status = "Will Unlock";

    return res.status(200).json({
      status: "success",
      summary: {
        vesselTurnRate_deg_per_sec,
        antennaSlewRate_deg_per_sec,
        trackingLoopMargin_deg,
        stabilizationMode,
        effectiveTrackingCapacity,
        deficit: deficit.toFixed(2),
        trackingStatus: status
      },
      recommendations: {
        vesselMotion:
          deficit > 0
            ? "Reduce turn rate or avoid sharp manoeuvres"
            : "Vessel motion within safe limits",
        antenna:
          antennaSlewRate_deg_per_sec < vesselTurnRate_deg_per_sec
            ? "Increase antenna slew rate or check ACU configuration"
            : "Antenna slew rate sufficient",
        stabilization:
          stabilizationMode === "gyro"
            ? "Gyro mode optimal for sharp turns"
            : "Consider switching to gyro mode for high manoeuvrability"
      }
    });
  } catch (error) {
    console.error("Slew Rate Mode error:", error);
    return res.status(500).json({
      error: "Slew Rate Mode failed",
      details: error?.message,
    });
  }
});

// ===============================
// SATCOM Alarm Pack Analysis (Pro) — FULL ENGINE MODE
// ===============================
app.post("/api/satcom/alarm-log", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { fileContent } = req.body;
  if (!fileContent || fileContent.trim() === "")
    return res.status(400).json({ error: "Field 'fileContent' is required." });

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: ALARM_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `
You are AMC Academy Tech AI — run FULL SATCOM ALARM PACK ANALYSIS ENGINE MODE.

Analyse the following SATCOM alarm log:

"${fileContent}"

Return your output STRICTLY in the following JSON structure:

{
  "summary": "2–3 sentence overview of the alarm pack",
  "affectedSubsystems": [
    "RF Chain",
    "BUC",
    "LNB",
    "Modem",
    "ACU",
    "IMU",
    "Power Supply",
    "Network",
    "NMS"
  ],
  "severity": {
    "critical": [],
    "major": [],
    "minor": []
  },
  "rootCauseHypotheses": [
    "Hypothesis 1",
    "Hypothesis 2",
    "Hypothesis 3"
  ],
  "recommendedActions": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "escalationGuidance": "When to escalate to NOC or manufacturer",
  "additionalInfoRequired": "What extra data is needed for deeper analysis"
}

Rules:
- Only include subsystems that appear relevant.
- Severity lists must contain alarm names or alarm categories.
- No text outside the JSON.
- No markdown.
- No commentary.
        `
        }
      ]
    });

    const output = completion.choices[0].message.content;

    return res.status(200).json({
      analysis: JSON.parse(output)
    });

  } catch (error) {
    console.error("Alarm analysis error:", error);
    return res.status(500).json({
      error: "Alarm analysis failed",
      details: error?.message
    });
  }
});

// ===============================
// Attachment Mode (Pro)
// ===============================

// Ensure attachments folder exists
const attachmentsFolder = path.join(__dirname, "attachments");
if (!fs.existsSync(attachmentsFolder)) {
  fs.mkdirSync(attachmentsFolder);
}

// Ensure attachments.json exists
const attachmentsFile = path.join(attachmentsFolder, "attachments.json");
if (!fs.existsSync(attachmentsFile)) {
  fs.writeFileSync(attachmentsFile, JSON.stringify([]));
}

app.post("/api/attachment", async (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { fileName, fileContent, vessel } = req.body;

  if (!fileContent)
    return res.status(400).json({ error: "Field 'fileContent' is required." });

  try {
    const existing = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      filename: fileName || "attachment.txt",
      vessel: vessel || "Unknown Vessel",
      content: fileContent
    };

    existing.push(entry);
    fs.writeFileSync(attachmentsFile, JSON.stringify(existing, null, 2));

    return res.status(200).json({
      status: "ok",
      message: "Attachment stored successfully",
      id: entry.id
    });

  } catch (error) {
    console.error("Attachment Mode error:", error);
    return res.status(500).json({
      error: "Attachment Mode failed",
      details: error?.message
    });
  }
});


// ===============================
// Vessel Intelligence Mode — Module 1
// Vessel Profile (Pro)
// ===============================

app.get("/api/vessel/:name/profile", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const vesselName = req.params.name;
  if (!vesselName || vesselName.trim() === "") {
    return res.status(400).json({ error: "Vessel name is required." });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));
    const nameLower = vesselName.toLowerCase();

    const cases = storageData.filter((item) => {
      const v =
        item.data &&
        typeof item.data.vessel === "string" &&
        item.data.vessel.toLowerCase();
      return v && v === nameLower;
    });

    const attachments = attachmentData.filter((item) => {
      const v =
        item.vessel &&
        typeof item.vessel === "string" &&
        item.vessel.toLowerCase();
      return v && v === nameLower;
    });

    const totalCases = cases.length;
    const totalAttachments = attachments.length;

    const regions = new Set();
    const orbitClasses = new Set();

    cases.forEach((item) => {
      if (item.data && item.data.region) {
        regions.add(item.data.region);
      }
      if (item.data && item.data.orbitClass) {
        orbitClasses.add(item.data.orbitClass);
      }
    });

    const profile = {
      vessel: vesselName,
      totalCases,
      totalAttachments,
      regions: Array.from(regions),
      orbitClasses: Array.from(orbitClasses),
      latestCase: totalCases > 0 ? cases[cases.length - 1] : null,
      latestAttachment:
        totalAttachments > 0 ? attachments[attachments.length - 1] : null,
    };

    return res.status(200).json({
      status: "success",
      profile,
    });
  } catch (error) {
    console.error("Vessel profile error:", error);
    return res.status(500).json({ error: "Failed to build vessel profile" });
  }
});

// ===============================
// Vessel Intelligence Mode — Module 2
// Vessel SATCOM Performance Score (Pro)
// ===============================

app.get("/api/vessel/:name/score", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const vesselName = req.params.name;
  if (!vesselName || vesselName.trim() === "") {
    return res.status(400).json({ error: "Vessel name is required." });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));
    const nameLower = vesselName.toLowerCase();

    const cases = storageData.filter((item) => {
      const v =
        item.data &&
        typeof item.data.vessel === "string" &&
        item.data.vessel.toLowerCase();
      return v && v === nameLower;
    });

    const attachments = attachmentData.filter((item) => {
      const v =
        item.vessel &&
        typeof item.vessel === "string" &&
        item.vessel.toLowerCase();
      return v && v === nameLower;
    });

    // ===============================
    // SCORING ENGINE
    // ===============================

    // Stability Score: based on number of cases
    let stabilityScore = 100;
    if (cases.length > 20) stabilityScore = 60;
    if (cases.length > 40) stabilityScore = 40;
    if (cases.length > 60) stabilityScore = 25;

    // RF Chain Reliability Score: based on RF-related cases
    const rfCases = cases.filter((c) => {
      return (
        c.data &&
        c.data.subsystem &&
        ["BUC", "LNB", "Modem", "RF Chain"].includes(c.data.subsystem)
      );
    });

    let rfScore = 100 - rfCases.length * 5;
    if (rfScore < 20) rfScore = 20;

    // Weather Fade Sensitivity Score: based on region + keywords
    const weatherCases = cases.filter((c) => {
      return (
        c.data &&
        c.data.issue &&
        c.data.issue.toLowerCase().includes("rain")
      );
    });

    let weatherScore = 100 - weatherCases.length * 10;
    if (weatherScore < 30) weatherScore = 30;

    // Alarm Frequency Score: based on attachments count
    let alarmScore = 100;
    if (attachments.length > 10) alarmScore = 70;
    if (attachments.length > 25) alarmScore = 40;
    if (attachments.length > 50) alarmScore = 20;

    // Diagnostics Severity Score: based on severity field
    const severityValues = cases
      .map((c) => (c.data && c.data.severity ? c.data.severity : null))
      .filter((s) => s !== null);

    let diagnosticsScore = 100;
    if (severityValues.length > 0) {
      const avgSeverity =
        severityValues.reduce((a, b) => a + b, 0) / severityValues.length;
      diagnosticsScore = 100 - avgSeverity * 10;
      if (diagnosticsScore < 20) diagnosticsScore = 20;
    }

    // Combined SATCOM Score
    const combinedScore = Math.round(
      (stabilityScore +
        rfScore +
        weatherScore +
        alarmScore +
        diagnosticsScore) /
        5
    );

    return res.status(200).json({
      status: "success",
      vessel: vesselName,
      scores: {
        stabilityScore,
        rfScore,
        weatherScore,
        alarmScore,
        diagnosticsScore,
        combinedScore,
      },
    });
  } catch (error) {
    console.error("Vessel score error:", error);
    return res.status(500).json({ error: "Failed to build vessel score" });
  }
});

// ===============================
// Vessel Intelligence Mode — Module 3
// Vessel Insights Engine (Pro)
// ===============================

app.get("/api/vessel/:name/insights", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const vesselName = req.params.name;
  if (!vesselName || vesselName.trim() === "") {
    return res.status(400).json({ error: "Vessel name is required." });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));
    const nameLower = vesselName.toLowerCase();

    const cases = storageData.filter((item) => {
      const v =
        item.data &&
        typeof item.data.vessel === "string" &&
        item.data.vessel.toLowerCase();
      return v && v === nameLower;
    });

    const attachments = attachmentData.filter((item) => {
      const v =
        item.vessel &&
        typeof item.vessel === "string" &&
        item.vessel.toLowerCase();
      return v && v === nameLower;
    });

    // ===============================
    // INSIGHT ENGINE
    // ===============================

    const insights = [];

    // 1. Recurring subsystem issues
    const subsystemCounts = {};
    cases.forEach((c) => {
      if (c.data && c.data.subsystem) {
        const s = c.data.subsystem;
        subsystemCounts[s] = (subsystemCounts[s] || 0) + 1;
      }
    });

    Object.keys(subsystemCounts).forEach((subsystem) => {
      if (subsystemCounts[subsystem] >= 3) {
        insights.push(
          `Recurring issues detected in the ${subsystem} subsystem (${subsystemCounts[subsystem]} cases).`
        );
      }
    });

    // 2. Weather fade sensitivity
    const rainCases = cases.filter(
      (c) =>
        c.data &&
        c.data.issue &&
        c.data.issue.toLowerCase().includes("rain")
    );

    if (rainCases.length >= 3) {
      insights.push(
        `High weather fade sensitivity detected — ${rainCases.length} rain-related cases.`
      );
    }

    // 3. Orbit behaviour patterns
    const orbitClasses = new Set();
    cases.forEach((c) => {
      if (c.data && c.data.orbitClass) {
        orbitClasses.add(c.data.orbitClass);
      }
    });

    if (orbitClasses.size > 1) {
      insights.push(
        `Vessel operates across multiple orbit classes: ${Array.from(
          orbitClasses
        ).join(", ")}.`
      );
    }

    // 4. Alarm frequency
    if (attachments.length > 20) {
      insights.push(
        `High alarm frequency detected — ${attachments.length} attachments logged.`
      );
    }

    // 5. Diagnostics severity trend
    const severityValues = cases
      .map((c) => (c.data && c.data.severity ? c.data.severity : null))
      .filter((s) => s !== null);

    if (severityValues.length > 0) {
      const avgSeverity =
        severityValues.reduce((a, b) => a + b, 0) / severityValues.length;

      if (avgSeverity >= 6) {
        insights.push(
          `Diagnostics indicate high severity trend (average severity ${avgSeverity.toFixed(
            1
          )}).`
        );
      }
    }

    // 6. No insights fallback
    if (insights.length === 0) {
      insights.push(
        "No significant SATCOM patterns detected for this vessel at this time."
      );
    }

    return res.status(200).json({
      status: "success",
      vessel: vesselName,
      insights,
    });
  } catch (error) {
    console.error("Vessel insights error:", error);
    return res.status(500).json({ error: "Failed to generate vessel insights" });
  }
});   // ← END OF INSIGHTS ROUTE

// ===============================
// Stripe Subscription Checkout
// ===============================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !PRICE_IDS[plan]) {
      return res.status(400).json({ error: "Invalid plan selected." });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1
        }
      ],
      success_url: "https://www.amcacademy.tech/success",
      cancel_url: "https://www.amcacademy.tech/cancel"
    });

    return res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ error: "Stripe session failed." });
  }
});

// ===============================
// Vessel Intelligence Mode — Module 4
// Vessel Predictive Intelligence (Pro)
// ===============================

app.get("/api/vessel/:name/predict", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const vesselName = req.params.name;
  if (!vesselName || vesselName.trim() === "") {
    return res.status(400).json({ error: "Vessel name is required." });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));
    const nameLower = vesselName.toLowerCase();

    const cases = storageData.filter((item) => {
      const v =
        item.data &&
        typeof item.data.vessel === "string" &&
        item.data.vessel.toLowerCase();
      return v && v === nameLower;
    });

    const attachments = attachmentData.filter((item) => {
      const v =
        item.vessel &&
        typeof item.vessel === "string" &&
        item.vessel.toLowerCase();
      return v && v === nameLower;
    });

    // ===============================
    // PREDICTIVE ENGINE
    // ===============================

    const totalCases = cases.length;
    const totalAttachments = attachments.length;

    const rainCases = cases.filter(
      (c) =>
        c.data &&
        c.data.issue &&
        c.data.issue.toLowerCase().includes("rain")
    );

    const severityValues = cases
      .map((c) => (c.data && c.data.severity ? c.data.severity : null))
      .filter((s) => s !== null);

    let avgSeverity = 0;
    if (severityValues.length > 0) {
      avgSeverity =
        severityValues.reduce((a, b) => a + b, 0) / severityValues.length;
    }

    // Base risk score
    let riskScore = 30;

    // More cases → higher risk
    if (totalCases > 20) riskScore += 10;
    if (totalCases > 40) riskScore += 10;

    // More alarms/attachments → higher risk
    if (totalAttachments > 20) riskScore += 10;
    if (totalAttachments > 40) riskScore += 10;

    // High severity → higher risk
    if (avgSeverity >= 5) riskScore += 15;
    if (avgSeverity >= 7) riskScore += 10;

    // Weather fade sensitivity → higher risk
    if (rainCases.length >= 3) riskScore += 15;

    if (riskScore > 100) riskScore = 100;

    const prediction = [];

    if (riskScore >= 80) {
      prediction.push(
        "High likelihood of future SATCOM instability. Consider proactive RF and ACU checks."
      );
    } else if (riskScore >= 60) {
      prediction.push(
        "Moderate risk of future SATCOM issues. Monitor alarms and weather-related events closely."
      );
    } else {
      prediction.push(
        "Low to moderate expected SATCOM risk based on current history."
      );
    }

    if (rainCases.length >= 3) {
      prediction.push(
        "Future instability is more likely during heavy rain or adverse weather conditions."
      );
    }

    if (avgSeverity >= 6) {
      prediction.push(
        `Average diagnostic severity (${avgSeverity.toFixed(
          1
        )}) suggests non-trivial future fault impact.`
      );
    }

    return res.status(200).json({
      status: "success",
      vessel: vesselName,
      riskScore,
      prediction,
      metrics: {
        totalCases,
        totalAttachments,
        rainCases: rainCases.length,
        avgSeverity,
      },
    });
  } catch (error) {
    console.error("Vessel predictive intelligence error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate predictive intelligence" });
  }
});

// ===============================
// SATCOM Knowledge Engine — Phase 8 Module 1
// Global SATCOM Pattern Engine (Pro)
// ===============================

app.get("/api/knowledge/patterns", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));

    // ===============================
    // GLOBAL PATTERN ENGINE
    // ===============================

    const regionSubsystemCounts = {};
    const orbitSubsystemCounts = {};
    const globalSubsystemCounts = {};

    storageData.forEach((item) => {
      const data = item.data || {};
      const region = data.region || "Unknown";
      const orbitClass = data.orbitClass || "Unknown";
      const subsystem = data.subsystem || "Unknown";

      // Global subsystem counts
      globalSubsystemCounts[subsystem] =
        (globalSubsystemCounts[subsystem] || 0) + 1;

      // Region + subsystem
      const regionKey = `${region}::${subsystem}`;
      regionSubsystemCounts[regionKey] =
        (regionSubsystemCounts[regionKey] || 0) + 1;

      // Orbit + subsystem
      const orbitKey = `${orbitClass}::${subsystem}`;
      orbitSubsystemCounts[orbitKey] =
        (orbitSubsystemCounts[orbitKey] || 0) + 1;
    });

    // Build human-readable patterns
    const regionPatterns = [];
    Object.keys(regionSubsystemCounts).forEach((key) => {
      const [region, subsystem] = key.split("::");
      const count = regionSubsystemCounts[key];
      if (count >= 3) {
        regionPatterns.push(
          `Subsystem ${subsystem} shows ${count} recorded issues in region ${region}.`
        );
      }
    });

    const orbitPatterns = [];
    Object.keys(orbitSubsystemCounts).forEach((key) => {
      const [orbitClass, subsystem] = key.split("::");
      const count = orbitSubsystemCounts[key];
      if (count >= 3) {
        orbitPatterns.push(
          `Subsystem ${subsystem} shows ${count} recorded issues in orbit class ${orbitClass}.`
        );
      }
    });

    const globalPatterns = [];
    Object.keys(globalSubsystemCounts).forEach((subsystem) => {
      const count = globalSubsystemCounts[subsystem];
      if (count >= 5) {
        globalPatterns.push(
          `Subsystem ${subsystem} appears in ${count} total cases across all vessels and regions.`
        );
      }
    });

    if (
      regionPatterns.length === 0 &&
      orbitPatterns.length === 0 &&
      globalPatterns.length === 0
    ) {
      globalPatterns.push(
        "No significant global SATCOM fault patterns detected at this time."
      );
    }

    return res.status(200).json({
      status: "success",
      patterns: {
        regionPatterns,
        orbitPatterns,
        globalPatterns,
      },
    });
  } catch (error) {
    console.error("Global SATCOM pattern engine error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate global SATCOM patterns" });
  }
});

// ===============================
// SATCOM Knowledge Engine — Phase 8 Module 2
// Case Similarity Search (Pro)
// ===============================

app.post("/api/knowledge/similar", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const queryCase = req.body || {};
  const queryIssue =
    (queryCase.issue && queryCase.issue.toLowerCase()) || "";
  const querySubsystem = queryCase.subsystem || "";
  const queryRegion = queryCase.region || "";
  const queryOrbitClass = queryCase.orbitClass || "";

  if (!queryIssue && !querySubsystem && !queryRegion && !queryOrbitClass) {
    return res
      .status(400)
      .json({ error: "At least one field (issue, subsystem, region, orbitClass) is required." });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));

    const similarCases = [];

    storageData.forEach((item) => {
      const data = item.data || {};
      const issue = (data.issue && data.issue.toLowerCase()) || "";
      const subsystem = data.subsystem || "";
      const region = data.region || "";
      const orbitClass = data.orbitClass || "";

      let score = 0;

      // Issue text similarity (simple keyword overlap)
      if (queryIssue && issue) {
        const qWords = queryIssue.split(/\s+/);
        const iWords = issue.split(/\s+/);
        const overlap = qWords.filter((w) => iWords.includes(w));
        if (overlap.length > 0) score += overlap.length * 2;
      }

      // Subsystem match
      if (querySubsystem && subsystem && querySubsystem === subsystem) {
        score += 5;
      }

      // Region match
      if (queryRegion && region && queryRegion === region) {
        score += 3;
      }

      // Orbit class match
      if (queryOrbitClass && orbitClass && queryOrbitClass === orbitClass) {
        score += 3;
      }

      if (score > 0) {
        similarCases.push({
          score,
          case: item,
        });
      }
    });

    // Sort by score descending
    similarCases.sort((a, b) => b.score - a.score);

    // Limit to top 10
    const topSimilar = similarCases.slice(0, 10);

    if (topSimilar.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No similar cases found based on the provided criteria.",
        similarCases: [],
      });
    }

    return res.status(200).json({
      status: "success",
      query: {
        issue: queryIssue,
        subsystem: querySubsystem,
        region: queryRegion,
        orbitClass: queryOrbitClass,
      },
      similarCases: topSimilar,
    });
  } catch (error) {
    console.error("Case similarity search error:", error);
    return res
      .status(500)
      .json({ error: "Failed to perform case similarity search" });
  }
});

// ===============================
// SATCOM Knowledge Engine — Phase 8 Module 3
// Fleet SATCOM Health Summary (Pro)
// ===============================

app.get("/api/knowledge/fleet-summary", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));
    const attachmentData = JSON.parse(fs.readFileSync(attachmentsFile, "utf8"));

    // ===============================
    // FLEET SUMMARY ENGINE
    // ===============================

    const totalCases = storageData.length;
    const totalAttachments = attachmentData.length;

    const subsystemCounts = {};
    const regionCounts = {};
    const orbitCounts = {};
    const severityValues = [];

    storageData.forEach((item) => {
      const data = item.data || {};

      // Subsystem
      const subsystem = data.subsystem || "Unknown";
      subsystemCounts[subsystem] = (subsystemCounts[subsystem] || 0) + 1;

      // Region
      const region = data.region || "Unknown";
      regionCounts[region] = (regionCounts[region] || 0) + 1;

      // Orbit class
      const orbitClass = data.orbitClass || "Unknown";
      orbitCounts[orbitClass] = (orbitCounts[orbitClass] || 0) + 1;

      // Severity
      if (data.severity !== undefined && data.severity !== null) {
        severityValues.push(data.severity);
      }
    });

    // Average severity
    let avgSeverity = 0;
    if (severityValues.length > 0) {
      avgSeverity =
        severityValues.reduce((a, b) => a + b, 0) / severityValues.length;
    }

    // Fleet Health Score (0–100)
    let fleetScore = 100;

    // More cases → lower score
    if (totalCases > 50) fleetScore -= 10;
    if (totalCases > 100) fleetScore -= 10;

    // More alarms → lower score
    if (totalAttachments > 50) fleetScore -= 10;
    if (totalAttachments > 100) fleetScore -= 10;

    // Higher severity → lower score
    if (avgSeverity >= 5) fleetScore -= 15;
    if (avgSeverity >= 7) fleetScore -= 10;

    if (fleetScore < 10) fleetScore = 10;

    // Build readable summaries
    const topSubsystems = Object.entries(subsystemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subsystem, count]) => `${subsystem}: ${count} cases`);

    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([region, count]) => `${region}: ${count} cases`);

    const topOrbits = Object.entries(orbitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([orbitClass, count]) => `${orbitClass}: ${count} cases`);

    return res.status(200).json({
      status: "success",
      fleetSummary: {
        totalCases,
        totalAttachments,
        avgSeverity,
        fleetScore,
        topSubsystems,
        topRegions,
        topOrbits,
      },
    });
  } catch (error) {
    console.error("Fleet summary error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate fleet SATCOM summary" });
  }
});

// ===============================
// SATCOM Knowledge Engine — Phase 8 Module 4
// Training Scenario Generator (Pro)
// ===============================

app.get("/api/knowledge/training-scenarios", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));

    if (!Array.isArray(storageData) || storageData.length === 0) {
      return res.status(200).json({
        status: "success",
        scenarios: [],
        message: "No cases available to generate training scenarios."
      });
    }

    const scenarios = storageData.slice(0, 20).map((item, index) => {
      const data = item.data || {};

      const subsystem = data.subsystem || "Unknown subsystem";
      const issue = data.issue || "Unspecified issue";
      const region = data.region || "Unknown region";
      const orbitClass = data.orbitClass || "Unknown orbit class";
      const severity = data.severity || "N/A";

      return {
        id: index + 1,
        title: `${subsystem} Fault Scenario`,
        description: `A real-world SATCOM fault involving the ${subsystem} subsystem. Issue reported: ${issue}.`,
        context: {
          region,
          orbitClass,
          severity
        },
        expectedSymptoms: [
          "Intermittent connectivity loss",
          "Reduced link stability",
          "Performance degradation under load",
          "Potential alarm triggers depending on subsystem"
        ],
        recommendedSteps: [
          "Verify subsystem power and physical connections",
          "Check modem/ACU logs for correlated events",
          "Perform subsystem-specific diagnostics",
          "Validate RF chain integrity if applicable",
          "Escalate to OEM if fault persists"
        ],
        assessmentQuestions: [
          `What is the most likely root cause of the ${subsystem} issue?`,
          `How does operating in the ${region} region affect this fault?`,
          `What diagnostic steps would you perform first?`,
          `How does ${orbitClass} orbit class influence link stability?`
        ]
      };
    });

    return res.status(200).json({
      status: "success",
      scenarios
    });
  } catch (error) {
    console.error("Training scenario generator error:", error);
    return res.status(500).json({
      error: "Failed to generate training scenarios"
    });
  }
});

// ===============================
// SATCOM Diagnostics Engine — Phase 9 Module 1
// AI Fault Analysis (Pro)
// ===============================

app.post("/api/diagnostics/analyse", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { issue, subsystem, region, orbitClass, severity } = req.body || {};

  if (!issue) {
    return res.status(400).json({
      error: "Issue description is required for diagnostics analysis."
    });
  }

  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, "utf8"));

    // ===============================
    // DIAGNOSTIC ENGINE
    // ===============================

    const issueLower = issue.toLowerCase();

    // Subsystem probability scoring
    const subsystemScores = {
      ACU: 0,
      BUC: 0,
      Modem: 0,
      Antenna: 0,
      RFChain: 0,
      Cabling: 0,
      Power: 0
    };

    // Keyword-based scoring
    if (issueLower.includes("tracking") || issueLower.includes("acu")) {
      subsystemScores.ACU += 20;
    }
    if (issueLower.includes("overcurrent") || issueLower.includes("buc")) {
      subsystemScores.BUC += 20;
    }
    if (issueLower.includes("lock loss") || issueLower.includes("modem")) {
      subsystemScores.Modem += 20;
    }
    if (issueLower.includes("signal") || issueLower.includes("antenna")) {
      subsystemScores.Antenna += 15;
    }
    if (issueLower.includes("rf") || issueLower.includes("chain")) {
      subsystemScores.RFChain += 15;
    }
    if (issueLower.includes("cable") || issueLower.includes("connector")) {
      subsystemScores.Cabling += 10;
    }
    if (issueLower.includes("power") || issueLower.includes("voltage")) {
      subsystemScores.Power += 10;
    }

    // Region influence
    if (region && region.toLowerCase().includes("west africa")) {
      subsystemScores.Modem += 5; // beam-edge instability
    }

    // Orbit influence
    if (orbitClass && orbitClass.toLowerCase() === "geo") {
      subsystemScores.ACU += 5; // GEO tracking sensitivity
    }

    // Severity influence
    let severityScore = severity || 4;
    if (severityScore >= 6) {
      subsystemScores.RFChain += 5;
      subsystemScores.BUC += 5;
    }

    // Build root cause estimation
    const sortedSubsystems = Object.entries(subsystemScores)
      .sort((a, b) => b[1] - a[1])
      .map(([name, score]) => ({ subsystem: name, score }));

    const topCause = sortedSubsystems[0];

    // Recommended engineering actions
    const recommendations = [
      "Verify physical connections and inspect for corrosion.",
      "Check ACU and modem logs for correlated events.",
      "Perform subsystem-specific diagnostics.",
      "Validate RF chain integrity and check connectors.",
      "If issue persists, escalate to OEM support."
    ];

    // ===============================
    // ⭐ ADD REPLY FIELD FOR FRONTEND
    // ===============================

    const replyText = `
Summary
${issue}

Key Points
- Likely root cause: ${topCause.subsystem}
- Severity score: ${severityScore}

Engineering Detail
Subsystem scoring:
${sortedSubsystems.map(s => `${s.subsystem}: ${s.score}`).join("\n")}

Recommendations
${recommendations.map(r => `- ${r}`).join("\n")}

Confidence Level: High
    `;

    // ===============================
    // FINAL RESPONSE
    // ===============================

    return res.status(200).json({
      status: "success",
      reply: replyText,
      diagnostics: {
        issue,
        region,
        orbitClass,
        severity: severityScore,
        subsystemScores: sortedSubsystems,
        likelyRootCause: topCause,
        recommendations
      }
    });

  } catch (error) {
    console.error("Diagnostics analysis error:", error);
    return res.status(500).json({
      error: "Failed to perform diagnostics analysis"
    });
  }
});

// ===============================
// SATCOM Diagnostics Engine — Phase 9 Module 2
// Fix Likelihood Prediction (Pro)
// ===============================

app.post("/api/diagnostics/fix-likelihood", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { issue, severity, subsystem } = req.body || {};

  if (!issue) {
    return res.status(400).json({
      error: "Issue description is required for fix likelihood analysis."
    });
  }

  try {
    const issueLower = issue.toLowerCase();
    const sev = severity || 4;

    let remoteFix = 50;
    let onboardFix = 30;
    let oemFix = 20;

    // Severity influence
    if (sev >= 6) {
      remoteFix -= 15;
      onboardFix += 10;
      oemFix += 5;
    }
    if (sev >= 8) {
      remoteFix -= 20;
      onboardFix += 10;
      oemFix += 10;
    }

    // Subsystem influence
    if (subsystem) {
      const sub = subsystem.toLowerCase();

      if (sub.includes("modem")) {
        remoteFix += 20;
      }
      if (sub.includes("acu")) {
        onboardFix += 15;
      }
      if (sub.includes("buc")) {
        oemFix += 20;
      }
      if (sub.includes("rf")) {
        onboardFix += 10;
      }
    }

    // Issue keyword influence
    if (issueLower.includes("tracking")) {
      onboardFix += 15;
    }
    if (issueLower.includes("lock loss")) {
      remoteFix += 10;
    }
    if (issueLower.includes("overcurrent")) {
      oemFix += 20;
    }

    // Normalize to 100
    const total = remoteFix + onboardFix + oemFix;
    remoteFix = Math.round((remoteFix / total) * 100);
    onboardFix = Math.round((onboardFix / total) * 100);
    oemFix = Math.round((oemFix / total) * 100);

    return res.status(200).json({
      status: "success",
      fixLikelihood: {
        remoteFix,
        onboardFix,
        oemFix,
        severity: sev,
        issue
      }
    });
  } catch (error) {
    console.error("Fix likelihood error:", error);
    return res.status(500).json({
      error: "Failed to calculate fix likelihood"
    });
  }
});

// ===============================
// SATCOM Diagnostics Engine — Phase 9 Module 3
// Subsystem Score Engine (Pro)
// ===============================

app.post("/api/diagnostics/subsystem-score", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { issue, region, orbitClass, severity } = req.body || {};

  if (!issue) {
    return res.status(400).json({
      error: "Issue description is required for subsystem scoring."
    });
  }

  try {
    const issueLower = issue.toLowerCase();
    const sev = severity || 4;

    const scores = {
      ACU: 10,
      BUC: 10,
      Modem: 10,
      Antenna: 10,
      RFChain: 10,
      Cabling: 10,
      Power: 10
    };

    // Issue keyword influence
    if (issueLower.includes("tracking")) scores.ACU += 25;
    if (issueLower.includes("lock loss")) scores.Modem += 20;
    if (issueLower.includes("overcurrent")) scores.BUC += 30;
    if (issueLower.includes("signal")) scores.Antenna += 15;
    if (issueLower.includes("rf")) scores.RFChain += 20;
    if (issueLower.includes("connector")) scores.Cabling += 15;
    if (issueLower.includes("voltage")) scores.Power += 15;

    // Region influence
    if (region && region.toLowerCase().includes("west africa")) {
      scores.Modem += 10; // beam-edge instability
    }

    // Orbit influence
    if (orbitClass && orbitClass.toLowerCase() === "geo") {
      scores.ACU += 10; // GEO tracking sensitivity
    }

    // Severity influence
    if (sev >= 6) {
      scores.RFChain += 10;
      scores.BUC += 10;
    }
    if (sev >= 8) {
      scores.ACU += 10;
      scores.BUC += 10;
      scores.RFChain += 10;
    }

    // Sort scores
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([name, score]) => ({ subsystem: name, score }));

    return res.status(200).json({
      status: "success",
      subsystemScores: sortedScores,
      severity: sev,
      issue
    });
  } catch (error) {
    console.error("Subsystem score error:", error);
    return res.status(500).json({
      error: "Failed to calculate subsystem scores"
    });
  }
});

// ===============================
// SATCOM Diagnostics Engine — Phase 9 Module 4
// Diagnostics Explanation Engine (Pro)
// ===============================

app.post("/api/diagnostics/explain", (req, res) => {
  if (!req.userIsPro) return requireProAccess(res);

  const { issue, subsystem, severity, region, orbitClass } = req.body || {};

  if (!issue) {
    return res.status(400).json({
      error: "Issue description is required for diagnostics explanation."
    });
  }

  try {
    const sev = severity || 4;

    // Build explanation
    let explanation = `The reported issue "${issue}" indicates a potential fault within the vessel's SATCOM system. `;

    if (subsystem) {
      explanation += `Initial analysis suggests the ${subsystem} subsystem is likely involved. `;
    }

    // Severity interpretation
    if (sev <= 3) {
      explanation += `The severity level is low, meaning the impact on connectivity is minimal and the fault is likely intermittent. `;
    } else if (sev <= 6) {
      explanation += `The severity level is moderate, indicating noticeable degradation in link stability or performance. `;
    } else {
      explanation += `The severity level is high, suggesting significant disruption to SATCOM connectivity and requiring urgent attention. `;
    }

    // Region influence
    if (region) {
      explanation += `Operating in the ${region} region may influence this fault due to known environmental or beam-edge conditions. `;
    }

    // Orbit influence
    if (orbitClass) {
      explanation += `The ${orbitClass} orbit class also affects system behaviour, particularly during tracking or handover events. `;
    }

    explanation += `Further diagnostics should be performed to confirm subsystem involvement and determine the appropriate corrective actions.`;

    return res.status(200).json({
      status: "success",
      explanation: {
        issue,
        subsystem,
        severity: sev,
        region,
        orbitClass,
        text: explanation
      }
    });
  } catch (error) {
    console.error("Diagnostics explanation error:", error);
    return res.status(500).json({
      error: "Failed to generate diagnostics explanation"
    });
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

// Stripe Webhook (subscription activation)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("✅ Subscription activated:", session.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// ===============================
// Validate Pro Access Key (Frontend calls this)
// ===============================

app.post("/api/validate-pro-key", (req, res) => {
  try {
    // ⭐ Accept key from BOTH body and header
    const key =
      req.body.key ||
      req.headers["x-access-key"] ||
      req.headers["authorization"] ||
      req.headers["x-pro-key"];

    if (!key || key.trim() === "") {
      return res.status(400).json({ valid: false, error: "Key is required." });
    }

    // ===============================
    // ⭐ Founder master key (env-based)
    // ===============================
    if (key === PRO_ACCESS_KEY) {
      return res.status(200).json({
        valid: true,
        message: "Master Key valid. Full AMC Academy Tech AI Pro unlocked.",
        type: "master",
        admin: true
      });
    }

    // ===============================
    // Load key store (array from environment)
    // ===============================
    let keys = [];
    try {
      keys = JSON.parse(process.env.PRO_KEYS_JSON || "[]");
    } catch (err) {
      console.error("❌ Failed to parse PRO_KEYS_JSON:", err);
      return res.status(500).json({
        valid: false,
        error: "key_store_error"
      });
    }

    const match = keys.find(k => k.key === key);

    if (!match) {
      return res.status(200).json({
        valid: false,
        message: "Invalid Pro Access Key."
      });
    }

    // ===============================
    // ⭐ JSON-based admin key (never expires)
    // ===============================
    if (match.type === "master") {
      return res.status(200).json({
        valid: true,
        message: "Admin Key valid. Full AMC Academy Tech AI Pro unlocked.",
        type: "master",
        admin: true
      });
    }

    // ===============================
    // ⭐ Customer key validation (expiry + active)
    // ===============================
    if (
      match.active === true &&
      match.expiry_at &&
      new Date(match.expiry_at) > new Date()
    ) {
      return res.status(200).json({
        valid: true,
        message: "Pro Access Key is valid. AMC Academy Tech AI Pro unlocked.",
        type: match.type,
        seats: match.seats,
        email: match.email
      });
    }

    // ===============================
    // ❌ Invalid or expired
    // ===============================
    return res.status(200).json({
      valid: false,
      message: "Invalid or expired Pro Access Key."
    });

  } catch (err) {
    console.error("Validator error:", err);
    return res.status(500).json({
      valid: false,
      error: "server_error"
    });
  }
});

// ===============================
// Test World Clock (UTC)
// ===============================
app.get("/api/test-world-clock", (req, res) => {
  const timestamp = worldClock();
  res.json({
    status: "ok",
    utc_time: timestamp
  });
});

