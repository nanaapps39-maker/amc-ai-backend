from flask import Flask, request, jsonify
import time

app = Flask(__name__)

usage_log = []

HEAVY_USAGE_THRESHOLD = 25
TIME_WINDOW_SECONDS = 300


# ======================================================
# ⭐ HEAVY USAGE CHECK (existing system)
# ======================================================
@app.route("/usage-check", methods=["POST"])
def usage_check():
    global usage_log

    current_time = time.time()
    usage_log.append(current_time)

    # Keep only timestamps within the last 5 minutes
    usage_log = [t for t in usage_log if current_time - t <= TIME_WINDOW_SECONDS]

    heavy_usage = len(usage_log) >= HEAVY_USAGE_THRESHOLD

    return jsonify({
        "heavy_usage": heavy_usage,
        "requests_last_5_min": len(usage_log)
    })


# ======================================================
# ⭐ HUMAN AWARENESS ENGINE — GLOBAL CULTURE + PATIENCE + SUPPORT
# ======================================================
@app.route("/human-awareness", methods=["POST"])
def human_awareness():
    data = request.json
    timestamp = time.time()

    # Track usage intensity
    usage_log.append(timestamp)
    usage_log[:] = [t for t in usage_log if timestamp - t <= TIME_WINDOW_SECONDS]
    usage_intensity = len(usage_log)

    # Extract message
    message = data.get("message", "").lower()

    # -----------------------------
    # ⭐ Frustration detection
    # -----------------------------
    frustration_keywords = [
        "confused", "stuck", "help", "why", "error", "not working",
        "broken", "issue", "problem", "fail"
    ]
    frustration = any(word in message for word in frustration_keywords)

    # -----------------------------
    # ⭐ Fatigue detection
    # -----------------------------
    fatigue_keywords = [
        "tired", "exhausted", "long", "break", "fatigue",
        "drained", "sleepy", "burnout"
    ]
    fatigue = any(word in message for word in fatigue_keywords)

    # -----------------------------
    # ⭐ Global cultural sensitivity
    # -----------------------------
    culture_keywords = [
        # Africa
        "ghana", "akan", "yoruba", "hausa", "swahili", "igbo", "zulu",
        "kenya", "nigeria", "ethiopia", "somalia", "tanzania",
        # Europe
        "british", "english", "french", "german", "spanish", "italian",
        "polish", "ukraine", "russia", "sweden", "norway",
        # Asia
        "chinese", "mandarin", "hindi", "japanese", "korean", "thai",
        "filipino", "vietnamese", "malaysia", "india", "pakistan",
        # Middle East
        "arabic", "turkish", "persian", "saudi", "qatar", "uae",
        "iran", "iraq", "egypt",
        # Americas
        "american", "latino", "brazilian", "mexican", "canadian",
        "argentina", "colombia", "chile",
        # General cultural signals
        "culture", "tradition", "respect", "heritage", "language",
        "custom", "community", "identity"
    ]
    culture_context = any(word in message for word in culture_keywords)

    # -----------------------------
    # ⭐ Patience detection
    # -----------------------------
    patience_keywords = [
        "trying", "learning", "practice", "step", "slow",
        "repeat", "again", "understand", "explain"
    ]
    patience_needed = any(word in message for word in patience_keywords)

    # -----------------------------
    # ⭐ Encouragement triggers
    # -----------------------------
    encouragement_keywords = [
        "almost", "nearly", "progress", "improve", "better",
        "getting there", "close", "learning well"
    ]
    encouragement_needed = any(word in message for word in encouragement_keywords)

    # -----------------------------
    # ⭐ Human support need
    # -----------------------------
    needs_support = (
        frustration or
        fatigue or
        patience_needed or
        usage_intensity > HEAVY_USAGE_THRESHOLD
    )

    return jsonify({
        "usage_intensity": usage_intensity,
        "frustration": frustration,
        "fatigue": fatigue,
        "culture_context": culture_context,
        "patience_needed": patience_needed,
        "encouragement_needed": encouragement_needed,
        "needs_support": needs_support
    })


if __name__ == "__main__":
    app.run(port=5001)
