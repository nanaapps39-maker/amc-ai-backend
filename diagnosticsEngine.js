// diagnosticsEngine.js
// Unified SATCOM Diagnostics Engine — AMC Academy Tech AI

import Groq from "groq-sdk";

// Safe JSON extractor
function extractJson(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("No JSON object found in model output.");
    }
    return JSON.parse(text.substring(start, end + 1));
  } catch (err) {
    console.error("Diagnostics JSON extraction error:", err);
    throw new Error("Invalid JSON returned by model.");
  }
}

// System prompt (clean + unified)
const DIAGNOSTICS_SYSTEM_PROMPT = `
You are AMC Academy Tech AI — a professional SATCOM diagnostics engine.

Return ONLY valid JSON. No commentary, no markdown, no extra text.
`;

export default async function runDiagnosticsEngine(query) {
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,

    // ⭐ FINAL HARD OVERRIDE — bypass Cloudflare FRA completely
    baseURL: "https://us.api.groq.com/openai/v1"
  });

  const completion = await client.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: DIAGNOSTICS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `
Run FULL SATCOM DIAGNOSTICS ENGINE MODE.

Analyse the following SATCOM issue:

"${query}"

Return your output STRICTLY in the following JSON structure:

{
  "analysis": "Technical breakdown of the issue",
  "rootCauseScores": {
    "hardware": "percentage",
    "rfChain": "percentage",
    "antenna": "percentage",
    "modem": "percentage",
    "network": "percentage",
    "configuration": "percentage",
    "environmental": "percentage"
  },
  "recommendedFix": "Step-by-step fix path",
  "riskAssessment": "Operational impact if unfixed",
  "finalSummary": "Concise maritime/SATCOM engineer summary"
}

No extra text outside the JSON.
        `
      }
    ]
  });

  const raw = completion.choices[0].message.content;
  return extractJson(raw);
}
