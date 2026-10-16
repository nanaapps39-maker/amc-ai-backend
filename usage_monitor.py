# usage_monitor.py — Telemetry Upgrade for AMC Academy Tech AI
from flask import Flask, request, jsonify
import time
import psutil
from datetime import datetime

app = Flask(__name__)

usage_log = []

HEAVY_USAGE_THRESHOLD = 25
TIME_WINDOW_SECONDS = 300

ENGINE_START_TIME = time.time()
LAST_ERROR = None

# ------------------------------------------------------
# Telemetry Snapshot
# ------------------------------------------------------
def get_usage_telemetry():
    uptime_seconds = int(time.time() - ENGINE_START_TIME)

    return {
        "uptime_seconds": uptime_seconds,
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "memory_percent": psutil.virtual_memory().percent,
        "last_error": LAST_ERROR,
        "requests_last_5_min": len(usage_log)
    }

def record_error(err_msg: str):
    global LAST_ERROR
    LAST_ERROR = {
        "message": err_msg,
        "time": datetime.utcnow().isoformat() + "Z"
    }

# ------------------------------------------------------
# ⭐ HEAVY USAGE CHECK (existing system)
# ------------------------------------------------------
@app.route("/usage-check", methods=["POST"])
def usage_check():
    global usage_log

    try:
        current_time = time.time()
        usage_log.append(current_time)

        usage_log = [t for t in usage_log if current_time - t <= TIME_WINDOW_SECONDS]

        heavy_usage = len(usage_log) >= HEAVY_USAGE_THRESHOLD

        return jsonify({
            "heavy_usage": heavy_usage,
            "requests_last_5_min": len(usage_log),
            "telemetry": get_usage_telemetry()
        })

    except Exception as e:
        record_error(str(e))
        return jsonify({"status": "error", "details": str(e)}), 500

# ------------------------------------------------------
# ⭐ HUMAN AWARENESS ENGINE — GLOBAL CULTURE + PATIENCE + SUPPORT
# ------------------------------------------------------
@app.route("/human-awareness", methods=["POST"])
def human_awareness():
    try:
        data = request.json
        timestamp = time.time()

        usage_log.append(timestamp)
        usage_log[:] = [t for t in usage_log if timestamp - t <= TIME_WINDOW_SECONDS]
        usage_intensity = len(usage_log)

        message = data.get("message", "").lower()

        frustration_keywords = [
            "confused", "stuck", "help", "why", "error", "not working",
            "broken", "issue", "problem", "fail"
        ]
        frustration = any(word in message for word in frustration_keywords)

        fatigue_keywords = [
            "tired", "exhausted", "long", "break", "fatigue",
            "drained", "sleepy", "burnout"
        ]
        fatigue = any(word in message for word in fatigue_keywords)

        culture_keywords = [
            "ghana", "akan", "yoruba", "hausa", "swahili", "igbo", "zulu",
            "kenya", "nigeria", "ethiopia", "somalia", "tanzania",
            "british", "english", "french", "german", "spanish", "italian",
            "polish", "ukraine", "russia", "sweden", "norway",
            "chinese", "mandarin", "hindi", "japanese", "korean", "thai",
            "filipino", "vietnamese", "malaysia", "india", "pakistan",
            "arabic", "turkish", "persian", "saudi", "qatar", "uae",
            "iran", "iraq", "egypt",
            "american", "latino", "brazilian", "mexican", "canadian",
            "argentina", "colombia", "chile",
            "culture", "tradition", "respect", "heritage", "language",
            "custom", "community", "identity"
        ]
        culture_context = any(word in message for word in culture_keywords)

        patience_keywords = [
            "trying", "learning", "practice", "step", "slow",
            "repeat", "again", "understand", "explain"
        ]
        patience_needed = any(word in message for word in patience_keywords)

        encouragement_keywords = [
            "almost", "nearly", "progress", "improve", "better",
            "getting there", "close", "learning well"
        ]
        encouragement_needed = any(word in message for word in encouragement_keywords)

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
            "needs_support": needs_support,
            "telemetry": get_usage_telemetry()
        })

    except Exception as e:
        record_error(str(e))
        return jsonify({"status": "error", "details": str(e)}), 500

# ------------------------------------------------------
# RUN SERVER
# ------------------------------------------------------
if __name__ == "__main__":
    app.run(port=5001)

