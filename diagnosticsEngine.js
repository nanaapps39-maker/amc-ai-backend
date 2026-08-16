// diagnosticsEngine.js
// Unified SATCOM Diagnostics Engine — AMC Academy Tech AI

import Groq from "groq-sdk";

// Ultra‑Robust JSON Extractor — AMC Academy Tech AI
function extractJson(text) {
  try {
    // 1. Find ALL possible JSON blocks using a safe regex
    const matches = text.match(/\{[\s\S]*?\}/g);

    if (!matches || matches.length === 0) {
      throw new Error("No JSON object found in model output.");
    }

    // 2. Try each match until one parses successfully
    for (const block of matches) {
      try {
        return JSON.parse(block);
      } catch (err) {
        // Try next block
      }
    }

    // 3. If none of the blocks parsed correctly
    throw new Error("Model returned JSON-like text, but none were valid JSON.");
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
    apiKey: process.env.GROQ_API_KEY
    // Let the SDK use its default, correct base URL
    // or explicitly:
    // baseURL: "https://api.groq.com/openai/v1"
  });

  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
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

