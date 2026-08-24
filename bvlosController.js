// bvlosController.js (ESM version)
// Core BVLOS SATCOM + FBB failover controller for AMC Academy Tech AI

// Active link state (default SATCOM)
let activeLink = "SATCOM";

// Hysteresis state to avoid rapid flapping
let lastSatScore = 1.0;
let lastFbbScore = 1.0;

// ---- Health scoring ----

function computeHealthScore(metrics) {
  const { latency_ms, packet_loss, jitter_ms } = metrics;

  // Base score
  let score = 1.0;

  // Latency impact
  if (latency_ms > 300 && latency_ms <= 600) score -= 0.2;
  else if (latency_ms > 600) score -= 0.4;

  // Packet loss impact
  if (packet_loss > 0.02 && packet_loss <= 0.05) score -= 0.3;
  else if (packet_loss > 0.05) score -= 0.5;

  // Jitter impact
  if (jitter_ms > 40 && jitter_ms <= 80) score -= 0.2;
  else if (jitter_ms > 80) score -= 0.3;

  // Clamp 0–1
  score = Math.max(0, Math.min(1, score));
  return score;
}

// ---- Failover decision logic ----

function decideActiveLink(satcomMetrics, fbbMetrics) {
  const satScore = computeHealthScore(satcomMetrics);
  const fbbScore = computeHealthScore(fbbMetrics);

  lastSatScore = satScore;
  lastFbbScore = fbbScore;

  // Thresholds
  const SAT_GOOD = 0.9;
  const SAT_DEGRADED = 0.7;
  const FBB_MIN = 0.5;

  // If SATCOM degraded and FBB is acceptable → failover to FBB
  if (satScore < SAT_DEGRADED && fbbScore >= FBB_MIN) {
    activeLink = "FBB";
  }

  // If SATCOM has clearly recovered → return to SATCOM
  if (satScore >= SAT_GOOD) {
    activeLink = "SATCOM";
  }

  return {
    activeLink,
    satScore,
    fbbScore,
  };
}

// ---- Command routing ----

async function sendViaSatcom(commandPayload) {
  return { via: "SATCOM", status: "sent" };
}

async function sendViaFbb(commandPayload) {
  return { via: "FBB", status: "sent" };
}

async function routeCommand(commandPayload) {
  if (activeLink === "SATCOM") {
    return sendViaSatcom(commandPayload);
  } else {
    return sendViaFbb(commandPayload);
  }
}

// ---- ESM EXPORT ----

export default {
  decideActiveLink,
  routeCommand,
  getState: () => ({
    activeLink,
    lastSatScore,
    lastFbbScore,
  }),
};

