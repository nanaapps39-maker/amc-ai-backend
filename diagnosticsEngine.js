export default async function runDiagnosticsEngine(query) {
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,

    // ⭐ FINAL HARD OVERRIDE — bypass Cloudflare FRA completely
    baseURL: "https://us.api.groq.com/openai/v1"
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
