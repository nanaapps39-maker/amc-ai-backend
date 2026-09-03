export default function compliance(req, res, next) {
  res.setHeader("X-AMC-ICO-Reference", "ZC236313");
  res.setHeader("X-AMC-GDPR", "Compliant");
  res.setHeader("X-AMC-Data-Controller", "Apps Maritime Consultancy Ltd");
  res.setHeader("X-AMC-AI-Version", "2026.09-R1");
  res.setHeader("X-AMC-Backend", "AMC Academy Tech AI Backend");
  next();
}

