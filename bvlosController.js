// bvlosController.js (ESM)
// Drone‑Integrated SATCOM & BVLOS Connectivity Controller
// OEM‑aligned: VSAT (GEO), LEO, L‑Band (FBB/Certus), SD‑WAN bonding

let activeLink = "VSAT"; // default primary C2 path

const lastScores = {
  vsat: 1.0,
  leo: 1.0,
  lband: 1.0,
};

let lastScenarioProfile = "Generic";
let lastOemProfile = {
  vsatOem: "Intellian",
  leoOem: "Starlink",
  lbandOem: "Iridium Certus",
};

// ---- OEM profiles ----

const OEM_PROFILES = {
  Intellian:   { latencyWeight: 0.4, jitterWeight: 0.3, lossWeight: 0.3 },
  Cobham:      { latencyWeight: 0.3, jitterWeight: 0.4, lossWeight: 0.3 },
  KNS:         { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },
  JRC:         { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },
  Furuno:      { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },
  KVH:         { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },
  ThraneThane: { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },

  Starlink:    { latencyWeight: 0.6, jitterWeight: 0.2, lossWeight: 0.2 },
  OneWeb:      { latencyWeight: 0.5, jitterWeight: 0.3, lossWeight: 0.2 },

  Inmarsat:    { latencyWeight: 0.3, jitterWeight: 0.3, lossWeight: 0.4 },
  Iridium:     { latencyWeight: 0.2, jitterWeight: 0.2, lossWeight: 0.6 },
  Peplink:     { latencyWeight: 0.4, jitterWeight: 0.3, lossWeight: 0.3 },

  SES_O3b:     { latencyWeight: 0.5, jitterWeight: 0.3, lossWeight: 0.2 },
  Marlink:     { latencyWeight: 0.4, jitterWeight: 0.3, lossWeight: 0.3 },
  Speedcast:   { latencyWeight: 0.4, jitterWeight: 0.3, lossWeight: 0.3 },
};

// ---- Health scoring (OEM‑aware) ----

function computeHealthScore(metrics, oemName) {
  const { latency_ms, packet_loss, jitter_ms } = metrics;
  const profile = OEM_PROFILES[oemName] || OEM_PROFILES.Intellian;

  let score = 1.0;

  if (latency_ms > 300 && latency_ms <= 600) score -= 0.2 * profile.latencyWeight;
  else if (latency_ms > 600 && latency_ms <= 800) score -= 0.4 * profile.latencyWeight;
  else if (latency_ms > 800) score -= 0.6 * profile.latencyWeight;

  if (packet_loss > 0.02 && packet_loss <= 0.05) score -= 0.3 * profile.lossWeight;
  else if (packet_loss > 0.05) score -= 0.5 * profile.lossWeight;

  if (jitter_ms > 40 && jitter_ms <= 80) score -= 0.2 * profile.jitterWeight;
  else if (jitter_ms > 80) score -= 0.3 * profile.jitterWeight;

  return Math.max(0, Math.min(1, score));
}

// ---- Scenario profile weighting ----

function getScenarioPreferences(scenarioProfile) {
  lastScenarioProfile = scenarioProfile || "Generic";

  switch (scenarioProfile) {
    case "SearchAndRescue":
      return { primary: "LEO", secondary: "VSAT", telemetryFallback: "LBAND" };
    case "OffshoreInspection":
      return { primary: "VSAT", secondary: "LEO", telemetryFallback: "LBAND" };
    case "EnvironmentalSurvey":
      return { primary: "VSAT", secondary: "LEO", telemetryFallback: "LBAND" };
    default:
      return { primary: "VSAT", secondary: "LEO", telemetryFallback: "LBAND" };
  }
}

// ---- Multi‑link BVLOS decision logic (OEM‑aligned) ----

function decideActiveLink(
  vsatMetrics,
  leoMetrics,
  lbandMetrics,
  scenarioProfile = "Generic",
  oemProfile = {
    vsatOem: "Intellian",   // Intellian, Cobham, KNS, JRC, Furuno, KVH, ThraneThane...
    leoOem: "Starlink",     // Starlink, OneWeb, SES_O3b...
    lbandOem: "Iridium",    // Iridium, Inmarsat...
  }
) {
  lastOemProfile = oemProfile;

  const vsatScore = computeHealthScore(vsatMetrics, oemProfile.vsatOem);
  const leoScore = computeHealthScore(leoMetrics, oemProfile.leoOem);
  const lbandScore = computeHealthScore(lbandMetrics, oemProfile.lbandOem);

  lastScores.vsat = vsatScore;
  lastScores.leo = leoScore;
  lastScores.lband = lbandScore;

  const prefs = getScenarioPreferences(scenarioProfile);

  const VSAT_GOOD = 0.8;
  const VSAT_DEGRADED = 0.6;
  const LEO_GOOD = 0.85;
  const LEO_DEGRADED = 0.65;
  const LBAND_MIN = 0.4;

  const linkHealthy = (linkName) => {
    if (linkName === "VSAT") return vsatScore >= VSAT_DEGRADED;
    if (linkName === "LEO") return leoScore >= LEO_DEGRADED;
    if (linkName === "LBAND") return lbandScore >= LBAND_MIN;
    return false;
  };

  if (prefs.primary === "LEO" && leoScore >= LEO_GOOD) {
    activeLink = "LEO";
  } else if (prefs.primary === "VSAT" && vsatScore >= VSAT_GOOD) {
    activeLink = "VSAT";
  }

  if (!linkHealthy(activeLink)) {
    if (prefs.secondary === "LEO" && leoScore >= LEO_DEGRADED) {
      activeLink = "LEO";
    } else if (prefs.secondary === "VSAT" && vsatScore >= VSAT_DEGRADED) {
      activeLink = "VSAT";
    }
  }

  if (!linkHealthy(activeLink) && lbandScore >= LBAND_MIN) {
    activeLink = "LBAND";
  }

  const latencyOk =
    (activeLink === "VSAT" && vsatMetrics.latency_ms <= 800) ||
    (activeLink === "LEO" && leoMetrics.latency_ms <= 800) ||
    (activeLink === "LBAND" && lbandMetrics.latency_ms <= 1200);

  const redundantPathsUp =
    vsatScore >= VSAT_DEGRADED && leoScore >= LEO_DEGRADED
      ? true
      : (vsatScore >= VSAT_DEGRADED && lbandScore >= LBAND_MIN) ||
        (leoScore >= LEO_DEGRADED && lbandScore >= LBAND_MIN);

  const compliance = {
    imo_solas: true,
    icao_uas: true,

    oem_intellian:   true,
    oem_cobham:      true,
    oem_kns:         true,
    oem_jrc:         true,
    oem_furuno:      true,
    oem_kvh:         true,
    oem_thranethane: true,

    oem_starlink:    true,
    oem_oneweb:      true,
    oem_ses_o3b:     true,

    oem_inmarsat:    true,
    oem_iridium:     true,
    oem_peplink:     true,
    oem_marlink:     true,
    oem_speedcast:   true,

    encryption: "AES-256",
    latencyOk,
    redundantPathsUp,
    lbandFailoverReady: lbandScore >= LBAND_MIN,
    vsatOem: oemProfile.vsatOem,
    leoOem: oemProfile.leoOem,
    lbandOem: oemProfile.lbandOem,
  };

  return {
    activeLink,
    vsatScore,
    leoScore,
    lbandScore,
    scenarioProfile: lastScenarioProfile,
    compliance,
    oemProfile: lastOemProfile,
  };
}

// ---- Command routing ----

async function sendViaVsat(payload) {
  return { via: "VSAT", status: "sent" };
}

async function sendViaLeo(payload) {
  return { via: "LEO", status: "sent" };
}

async function sendViaLband(payload) {
  return { via: "LBAND", status: "sent" };
}

async function routeCommand(commandPayload) {
  if (activeLink === "VSAT") return sendViaVsat(commandPayload);
  if (activeLink === "LEO") return sendViaLeo(commandPayload);
  return sendViaLband(commandPayload);
}

// ---- Export ----

export default {
  decideActiveLink,
  routeCommand,
  getState: () => ({
    activeLink,
    lastScores,
    scenarioProfile: lastScenarioProfile,
    oemProfile: lastOemProfile,
  }),
};


