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

