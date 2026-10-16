// satcom/weatherFade.js
// AMC Academy Tech AI — Unified SATCOM Weather Fade Engine (ITU-R Model)

export default function calculateWeatherFade({
  frequencyGHz,
  rainRate_mm_per_hr,
  region,
  linkMargin_dB
}) {
  // ITU‑R rain fade approximation (Ku/Ka band sensitivity)
  const k = frequencyGHz > 20 ? 0.15 : 0.08;   // Ka-band more sensitive
  const alpha = frequencyGHz > 20 ? 1.1 : 0.9; // Ka-band exponent

  const rainAttenuation_dB = k * Math.pow(rainRate_mm_per_hr, alpha);

  // No atmospheric loss term — unified with your deployed engine
  const remainingMargin_dB = linkMargin_dB - rainAttenuation_dB;

  let linkStatus = "Good";
  if (remainingMargin_dB < 8) linkStatus = "Marginal";
  if (remainingMargin_dB < 3) linkStatus = "Fail";

  return {
    frequencyGHz,
    region,
    rainRate_mm_per_hr,
    rainAttenuation_dB: Number(rainAttenuation_dB.toFixed(2)),
    remainingMargin_dB: Number(remainingMargin_dB.toFixed(2)),
    linkStatus,
    model: "ITU-R rain fade approximation"
  };
}
