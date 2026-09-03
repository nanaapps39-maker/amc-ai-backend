module.exports = (req, res, next) => {
  // ICO Compliance Headers
  res.setHeader("X-AMC-ICO-Reference", "ZC236313");
  res.setHeader("X-AMC-GDPR", "Compliant");
  res.setHeader("X-AMC-Data-Controller", "Apps Maritime Consultancy Ltd");

  // AMC AI Versioning Metadata
  res.setHeader("X-AMC-AI-Version", "2026.09-R1");
  res.setHeader("X-AMC-Backend", "AMC Academy Tech AI Backend");

  next();
};
