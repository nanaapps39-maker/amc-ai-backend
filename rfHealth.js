// satcom/rfHealth.js
// AMC Academy Tech AI — RF Chain Health & Diagnostics Engine

export function calculateRfHealth({
  antennaGain_dBi,
  cableLoss_dB,
  bucPower_dBW,
  lnbNoiseTemp_K
}) {
  // Antenna health score
  const antennaHealth = antennaGain_dBi >= 38 ? "Healthy" : "Underperforming";

  // Cable loss impact
  const cableHealth = cableLoss_dB <= 3 ? "Good" : "High Loss";

  // BUC performance
  const bucHealth = bucPower_dBW >= 20 ? "Nominal" : "Low Output";

  // LNB noise temperature
  const noiseHealth = lnbNoiseTemp_K <= 120 ? "Good" : "High Noise";

  // Overall RF chain score
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
    antennaHealth,
    cableHealth,
    bucHealth,
    noiseHealth,
    rfStatus
  };
}
