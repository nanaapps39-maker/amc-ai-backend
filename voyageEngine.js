// voyageEngine.js
// AMC Academy Tech AI — Voyage Distance & ETA Engine (Great Circle Method)

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function calculateGreatCircle(lat1, lon1, lat2, lon2) {
  // Convert degrees → radians
  const lat1_r = toRadians(lat1);
  const lat2_r = toRadians(lat2);
  const dLon_r = toRadians(lon2 - lon1);

  // Great Circle formula
  const d = Math.acos(
    Math.sin(lat1_r) * Math.sin(lat2_r) +
    Math.cos(lat1_r) * Math.cos(lat2_r) * Math.cos(dLon_r)
  );

  // Convert radians → nautical miles
  const distanceNm = d * 60 * (180 / Math.PI);
  return distanceNm;
}

function calculateVoyage(lat1, lon1, lat2, lon2, speedKnots, departureTimeUTC) {
  const distanceNm = calculateGreatCircle(lat1, lon1, lat2, lon2);

  // Duration in hours
  const durationHours = distanceNm / speedKnots;

  // ETA calculation
  const departure = new Date(departureTimeUTC);
  const eta = new Date(departure.getTime() + durationHours * 3600 * 1000);

  return {
    distanceNm: Number(distanceNm.toFixed(2)),
    durationHours: Number(durationHours.toFixed(2)),
    etaUTC: eta.toISOString()
  };
}

module.exports = { calculateVoyage };
