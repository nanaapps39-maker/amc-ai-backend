// satcom/weatherFade.js
// AMC Academy Tech AI — SATCOM Rain Fade & Atmospheric Loss Engine

export function calculateWeatherFade({
  frequencyGHz,
  rainRate_mm_per_hr,
  region,
  linkMargin_dB
}) {
  // ITU rain fade approximation
  const k = 0.0001 * frequencyGHz;
  const alpha = 1.1;
  const rainAttenuation_dB = k * Math.pow(rainRate_mm_per_hr, alpha);

  // Atmospheric loss (baseline)
  const atmosphericLoss_dB = frequencyGHz * 0.05;

  const totalLoss_dB = rainAttenuation_dB + atmosphericLoss_dB;

  const remainingMargin_dB = linkMargin_dB - totalLoss_dB;

  let linkStatus = "Good";
  if (remainingMargin_dB < 3) linkStatus = "Marginal";
  if (remainingMargin_dB < 0) linkStatus = "Fail";

  return {
    rainAttenuation_dB: Number(rainAttenuation_dB.toFixed(2)),
    atmosphericLoss_dB: Number(atmosphericLoss_dB.toFixed(2)),
    totalLoss_dB: Number(totalLoss_dB.toFixed(2)),
    remainingMargin_dB: Number(remainingMargin_dB.toFixed(2)),
    linkStatus
  };
}
