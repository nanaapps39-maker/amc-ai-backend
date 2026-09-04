// diagnosticsEngine.js
import Groq from "groq-sdk";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

// Ultra‑Robust JSON Extractor — AMC Academy Tech AI
function extractJson(text) {
  try {
    // Remove markdown fences
    text = text.replace(/```json/gi, "").replace(/```/g, "");

    // Extract first valid JSON block
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in model output.");
    }

    const jsonText = text.substring(firstBrace, lastBrace + 1);

    return JSON.parse(jsonText);
  } catch (err) {
    console.error("Diagnostics JSON extraction error:", err);
    throw new Error("Invalid JSON returned by model.");
  }
}

// System prompt (clean + unified)
const DIAGNOSTICS_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — a professional SATCOM diagnostics engine.

You MUST return ONLY valid JSON.
Never return markdown.
Never return code fences.
Never return commentary.
Never return explanations.
Never return text before or after the JSON.
Never return single quotes.
Never return trailing commas.
Never return unescaped characters.

If you cannot produce valid JSON, return {}.
`;

export default async function runDiagnosticsEngine(query) {
  // -----------------------------------------------------------
  // 1. Run Groq JSON SATCOM Diagnostics (your existing engine)
  // -----------------------------------------------------------
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    response_format: { type: "json_object" },

    messages: [
      { role: "system", content: DIAGNOSTICS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `
Run FULL SATCOM DIAGNOSTICS ENGINE MODE.

Analyse the following SATCOM issue:

"${query}"

You MUST return ONLY valid JSON.
Follow EXACTLY this structure:

{
  "analysis": "",
  "rootCauseScores": {
    "hardware": "",
    "rfChain": "",
    "antenna": "",
    "modem": "",
    "network": "",
    "configuration": "",
    "environmental": ""
  },
  "recommendedFix": "",
  "riskAssessment": "",
  "finalSummary": ""
}

Do NOT include any text before or after the JSON.
Do NOT include markdown.
Do NOT include code fences.
Do NOT include comments.
Do NOT include explanations.
`
      }
    ]
  });

  const rawGroq = completion.choices[0].message.content;
  const groqDiagnostics = extractJson(rawGroq);

  // -----------------------------------------------------------
  // 2. Run SATCOM Reasoning Engine v2 (Python microservice)
  // -----------------------------------------------------------
  let satcomV2 = null;

  try {
    satcomV2 = await runSatcomReasoning(query);
  } catch (err) {
    console.error("SATCOM v2 engine error:", err.message);
    satcomV2 = {
      status: "error",
      engine: "satcom-v2",
      message: "SATCOM Reasoning Engine v2 unavailable",
      details: err.message
    };
  }

  // -----------------------------------------------------------
  // 3. Merge Groq Diagnostics + SATCOM v2 Reasoning
  // -----------------------------------------------------------
  return {
    status: "ok",
    engine: "diagnostics-v2",
    groq: groqDiagnostics,
    satcomV2: satcomV2.reasoning || satcomV2,
    summary: {
      combinedConfidence: satcomV2?.reasoning?.confidence || "Medium",
      engines: {
        groq: "active",
        satcomV2: satcomV2?.status === "ok" ? "active" : "offline"
      }
    }
  };
}
