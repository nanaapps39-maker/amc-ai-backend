// tonnageEngine.js (Pro Mode)
module.exports = function runTonnageAnalytics(tonnage) {
  const { dwt, vesselType } = tonnage;

  const gt = dwt * 0.35;
  const nt = dwt * 0.22;
  const displacement = dwt * 1.05;

  return {
    dwt,
    vesselType,
    grossTonnage: gt,
    netTonnage: nt,
    displacementTonnes: displacement,
    notes: "Pro Mode tonnage analytics generated successfully."
  };
};
