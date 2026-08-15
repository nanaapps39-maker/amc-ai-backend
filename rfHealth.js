// rfHealth.js
// AMC Academy Tech AI — Unified RF Chain Health & Diagnostics Engine

export default function calculateRfHealth({
  antennaGain_dBi,
  cableLoss_dB,
  bucPower_dBW,
  lnbNoiseTemp_K
}) {
  // Antenna health
  const antennaHealth = antennaGain_dBi >= 38 ? "Healthy" : "Underperforming";

  // Cable loss
  const cableHealth = cableLoss_dB <= 3 ? "Good" : "High Loss";

  // BUC performance
  const bucHealth = bucPower_dBW >= 20 ? "Nominal" : "Low Output";

  // LNB noise temperature
  const noiseHealth = lnbNoiseTemp_K <= 120 ? "Good" : "High Noise";

  const scoreMap = {
    Healthy: 3,
    Good: 3,
    Nominal: 3,
    "High Loss": 1,
    "Low Output": 1,
    "High Noise": 1,
    Underperforming: 1
  };

  const totalScore =
    scoreMap[antennaHealth] +
    scoreMap[cableHealth] +
    scoreMap[bucHealth] +
    scoreMap[noiseHealth];

  let rfStatus = "Excellent";
  if (totalScore <= 8) rfStatus = "Warning";
  if (totalScore <= 5) rfStatus = "Critical";

  return {
    antennaGain_dBi,
    cableLoss_dB,
    bucPower_dBW,
    lnbNoiseTemp_K,
    antennaHealth,
    cableHealth,
    bucHealth,
    noiseHealth,
    totalScore,
    rfStatus,
    model: "AMC RF Health heuristic"
  };
}

