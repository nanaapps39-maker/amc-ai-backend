const fs = require('fs');

module.exports = function validateKey(req, res) {
    const { key } = req.body;

    // ⭐ Improvement: handle missing or empty key
    if (!key || key.trim() === "") {
        return res.status(400).json({
            valid: false,
            error: "Key is required."
        });
    }

    // Load stored keys
    let keys = [];
    try {
        keys = JSON.parse(fs.readFileSync('./pro-keys.json', 'utf8'));
    } catch (err) {
        // If file missing or corrupted, fail safely
        return res.json({ valid: false });
    }

    // Find matching key
    const match = keys.find(k => k.key === key);

    // Validate active subscription
    if (!match || !match.active) {
        return res.json({ valid: false });
    }

    // Success response
    res.json({
        valid: true,
        email: match.email,
        created_at: match.created_at
    });
};

