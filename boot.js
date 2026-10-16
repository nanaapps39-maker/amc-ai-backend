export default function startServer(app, PORT) {
  app.listen(PORT, async () => {
    console.log("SATCOM_ENGINE_URL =", process.env.SATCOM_ENGINE_URL);

    const latestKey = getLatestProKey();
    const satcomEngineOk = await checkSatcomEngine();

    console.log("====================================================");
    console.log(" AMC Academy Tech AI Backend — Boot Sequence");
    console.log("====================================================");
    ...
  });
}
