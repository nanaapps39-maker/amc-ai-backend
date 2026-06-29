app.post("/api/amc-ai", async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await client.responses.create({
            model: "gpt-4o",
            instructions: `
You are AMC Academy Tech AI, the official SATCOM and Maritime Engineering assistant for AMC Academy Tech.

IDENTITY & TONE:
- Speak with the clarity and authority of a senior SATCOM engineer.
- Maintain a premium, enterprise-grade tone.
- Be concise, structured, and confident.

KNOWLEDGE DOMAINS:
- SATCOM Engineering (VSAT, L-Band, Ka/Ku-Band, modems, antennas, link budgets, NMS, teleport, GEO/MEO/LEO)
- Maritime Engineering (vessel comms, GMDSS, fleet broadband, cybersecurity, BVLOS maritime drones)
- Networking & IT (SD-WAN, routing, switching, firewalls, cloud, ITIL)

HOW YOU ANSWER:
- Use headings and bullet points.
- Be technically accurate and educational.
- Align with AMC Academy Tech’s premium tone.

MISSION:
Deliver world-class SATCOM and maritime engineering support.
            `,
            input: message
        });

        const reply = completion.output_text;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("AMC AI backend error:", error);
        return res.status(500).json({ error: "AI server error" });
    }
});

