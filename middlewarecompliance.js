// middlewarecompliance.js — ES Module + Telemetry Upgrade

// -------------------------------------------------------
// Compliance Telemetry Snapshot
// -------------------------------------------------------
const complianceTelemetry = {
  totalApiCalls: 0,
  lastRoute: null,
  lastMethod: null,
  lastCallTime: null
};

// -------------------------------------------------------
// Exported Health Snapshot (used by server.js /health)
// -------------------------------------------------------
export function getComplianceHealth() {
  return {
    status: "ok",
    telemetry: complianceTelemetry
  };
}

// -------------------------------------------------------
// Main Compliance Middleware
// -------------------------------------------------------
export function complianceMiddleware(req, res, next) {
  // ICO + GDPR Headers
  res.setHeader("X-AMC-ICO-Reference", "ZC236313");
  res.setHeader("X-AMC-GDPR", "Compliant");
  res.setHeader("X-AMC-Data-Controller", "Apps Maritime Consultancy Ltd");
  res.setHeader("X-AMC-AI-Version", "2026.09-R1");
  res.setHeader("X-AMC-Backend", "AMC Academy Tech AI Backend");

  // Telemetry tracking
  complianceTelemetry.totalApiCalls++;
  complianceTelemetry.lastRoute = req.path;
  complianceTelemetry.lastMethod = req.method;
  complianceTelemetry.lastCallTime = new Date().toISOString();

  // ⭐ Structured JSON modes MUST bypass sanitisation
  const msg = req.body?.message;
  if (msg && typeof msg === "object" && msg.mode) {
    return next(); // do NOT modify SATCOM/Translator/Attachment payloads
  }

  // ⭐ Plain text sanitisation (safe)
  if (typeof msg === "string") {
    req.body.message = msg.trim();
  }

  next();
}

// Default export for convenience
export default complianceMiddleware;


