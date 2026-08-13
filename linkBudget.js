// satcom/linkBudget.js
// AMC Academy Tech AI — Enterprise SATCOM Link Budget Engine

export function calculateLinkBudget({
  frequencyGHz,
  txPower_dBW,
  txAntennaGain_dBi,
  rxAntennaGain_dBi,
  pathLoss_dB,
  rxSystemNoise_dBm
}) {
  // EIRP
  const eirp_dBW = txPower_dBW + txAntennaGain_dBi;

  // Received power (dBm)
  const receivedPower_dBm = eirp_dBW - pathLoss_dB + rxAntennaGain_dBi + 30;

  // Carrier-to-noise ratio (C/N)
  const cn_dB = receivedPower_dBm - rxSystemNoise_dBm;

  // Link margin
  const requiredCn_dB = 10; // baseline threshold
  const linkMargin_dB = cn_dB - requiredCn_dB;

  // Link status
  let linkStatus = "Good";
  if (linkMargin_dB < 3) linkStatus = "Marginal";
  if (linkMargin_dB < 0) linkStatus = "Fail";

  return {
    eirp_dBW: Number(eirp_dBW.toFixed(2)),
    receivedPower_dBm: Number(receivedPower_dBm.toFixed(2)),
    cn_dB: Number(cn_dB.toFixed(2)),
    linkMargin_dB: Number(linkMargin_dB.toFixed(2)),
    linkStatus
  };
}
