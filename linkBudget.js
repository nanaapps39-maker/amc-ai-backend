// linkBudget.js
// AMC Academy Tech AI — Unified SATCOM Link Budget Engine (A+ Physics)

export default function calculateLinkBudget({
  frequencyGHz,
  txPower_dBW,
  txAntennaGain_dBi,
  rxAntennaGain_dBi,
  pathLoss_dB,
  rxSystemNoise_dBm,
  elevationDeg = 20,          // new: elevation angle
  rainRate_mm_per_h = 0       // new: rain fade modelling
}) {
  // --- 1. EIRP (dBW) ---
  const eirp_dBW = txPower_dBW + txAntennaGain_dBi;

  // --- 2. Atmospheric loss (A+ physics) ---
  const atmLoss_dB = estimateAtmosphericLoss(frequencyGHz, elevationDeg);

  // --- 3. Rain fade (A+ physics) ---
  const rainFade_dB = estimateRainFade(frequencyGHz, elevationDeg, rainRate_mm_per_h);

  // --- 4. Total propagation loss ---
  const totalPathLoss_dB = pathLoss_dB + atmLoss_dB + rainFade_dB;

  // --- 5. Received power (dBm) ---
  const receivedPower_dBm =
    eirp_dBW - totalPathLoss_dB + rxAntennaGain_dBi + 30;

  // --- 6. Carrier-to-noise ratio (C/N) ---
  const cn_dB = receivedPower_dBm - rxSystemNoise_dBm;

  // --- 7. Required C/N threshold ---
  const requiredCn_dB = 10;

  // --- 8. Link margin ---
  const linkMargin_dB = cn_dB - requiredCn_dB;

  // --- 9. Link status ---
  let linkStatus = "Good";
  if (linkMargin_dB < 3) linkStatus = "Marginal";
  if (linkMargin_dB < 0) linkStatus = "Fail";

  // --- 10. Survivability score (0–100) ---
  const survivabilityScore = computeSurvivabilityScore(linkMargin_dB, rainFade_dB);

  return {
    frequencyGHz,
    txPower_dBW,
    txAntennaGain_dBi,
    rxAntennaGain_dBi,
    pathLoss_dB,
    rxSystemNoise_dBm,
    elevationDeg,
    rainRate_mm_per_h,

    // A+ physics
    atmLoss_dB: Number(atmLoss_dB.toFixed(2)),
    rainFade_dB: Number(rainFade_dB.toFixed(2)),
    totalPathLoss_dB: Number(totalPathLoss_dB.toFixed(2)),

    // original math
    eirp_dBW: Number(eirp_dBW.toFixed(2)),
    receivedPower_dBm: Number(receivedPower_dBm.toFixed(2)),
    cn_dB: Number(cn_dB.toFixed(2)),
    linkMargin_dB: Number(linkMargin_dB.toFixed(2)),
    linkStatus,

    // A+ survivability
    survivabilityScore,

    model: "Unified SATCOM Link Budget Engine (A+)"
  };
}

// ------------------------------------------------------------
// A+ Physics Helpers
// ------------------------------------------------------------

// Atmospheric absorption (oxygen + water vapour + clouds)
function estimateAtmosphericLoss(frequencyGHz, elevationDeg) {
  let baseLoss = 0.3; // baseline

  if (frequencyGHz >= 10 && frequencyGHz < 20) baseLoss += 0.7;   // Ku-band
  if (frequencyGHz >= 20) baseLoss += 1.5;                        // Ka-band

  if (elevationDeg < 10) baseLoss += 1.0;
  else if (elevationDeg < 20) baseLoss += 0.5;

  return baseLoss;
}

// Rain fade (simplified ITU-style)
function estimateRainFade(frequencyGHz, elevationDeg, rainRate_mm_per_h) {
  if (rainRate_mm_per_h <= 0) return 0;

  let k = 0.02; // baseline
  if (frequencyGHz >= 10 && frequencyGHz < 20) k = 0.05;  // Ku
  if (frequencyGHz >= 20) k = 0.08;                       // Ka

  const elevationFactor = Math.max(0.5, 20 / Math.max(elevationDeg, 5));
  return k * rainRate_mm_per_h * elevationFactor;
}

// Survivability score (0–100)
function computeSurvivabilityScore(linkMargin_dB, rainFade_dB) {
  let score = 50 + linkMargin_dB * 3 - rainFade_dB * 2;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}

