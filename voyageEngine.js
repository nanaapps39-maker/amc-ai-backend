// voyageEngine.js
// AMC Academy Tech AI — Voyage Distance & ETA Engine (Great Circle Method)

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function calculateGreatCircle(lat1, lon1, lat2, lon2) {
  const lat1_r = toRadians(lat1);
  const lat2_r = toRadians(lat2);
  const dLon_r = toRadians(lon2 - lon1);

  const d = Math.acos(
    Math.sin(lat1_r) * Math.sin(lat2_r) +
    Math.cos(lat1_r) * Math.cos(lat2_r) * Math.cos(dLon_r)
  );

  const distanceNm = d * 60 * (180 / Math.PI);
  return distanceNm;
}

// ⭐ UPDATED — Accept port objects OR raw lat/lon
function calculateVoyage(p1, p2, speedKnots = 14, departureTimeUTC = new Date().toISOString()) {
  const lat1 = p1.lat ?? p1[0];
  const lon1 = p1.lon ?? p1[1];
  const lat2 = p2.lat ?? p2[0];
  const lon2 = p2.lon ?? p2[1];

  const distanceNm = calculateGreatCircle(lat1, lon1, lat2, lon2);

  const durationHours = distanceNm / speedKnots;

  const departure = new Date(departureTimeUTC);
  const eta = new Date(departure.getTime() + durationHours * 3600 * 1000);

  return {
    distanceNm: Number(distanceNm.toFixed(2)),
    durationHours: Number(durationHours.toFixed(2)),
    etaUTC: eta.toISOString()
  };
}

export { calculateVoyage };



