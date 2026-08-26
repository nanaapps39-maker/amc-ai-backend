from flask import Flask, request, jsonify
import time

app = Flask(__name__)

usage_log = []

HEAVY_USAGE_THRESHOLD = 25      # 25 requests
TIME_WINDOW_SECONDS = 300       # 5 minutes

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

if __name__ == "__main__":
    app.run(port=5001)
