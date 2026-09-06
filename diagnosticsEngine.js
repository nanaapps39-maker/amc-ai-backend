// diagnosticsEngine.js
import Groq from "groq-sdk";
import { runSatcomReasoning } from "./satcomEngineConnector.js";

// ⭐ NEW — Ghana Fleet Loader
import { loadGhanaFleet } from "./loadGhanaFleet.js";
const ghanaFleet = loadGhanaFleet();

// Ultra‑Robust JSON Extractor — AMC Academy Tech AI
function extractJson(text) {
  try {
    text = text.replace(/```json/gi, "").replace(/```/g, "");
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
...
`;

export default async function runDiagnosticsEngine(query) {
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
...
`
      }
    ]
  });

  const rawGroq = completion.choices[0].message.content;
  const groqDiagnostics = extractJson(rawGroq);

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

  return {
    status: "ok",
    engine: "diagnostics-v2",
    groq: groqDiagnostics,
    satcomV2: satcomV2.reasoning || satcomV2,

    // ⭐ You can now use Ghana fleet data anywhere
    ghanaFleet: ghanaFleet,

    summary: {
      combinedConfidence: satcomV2?.reasoning?.confidence || "Medium",
      engines: {
        groq: "active",
        satcomV2: satcomV2?.status === "ok" ? "active" : "offline"
      }
    }
  };
}

