# ======================================================
# AMC ACADEMY TECH AI — SATCOM REASONING ENGINE
# Python Microservice — FastAPI Build
# ======================================================

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ======================================================
# REQUEST MODEL
# ======================================================
class SatcomRequest(BaseModel):
    message: str
    module: str
    log_text: str | None = None

# ======================================================
# FASTAPI APP
# ======================================================
app = FastAPI()

# CORS (allow Node.js backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# CORE DIAGNOSTIC ENGINE
# ======================================================
def run_reasoning_engine(user_message: str, log_text: str | None):
    """
    Core SATCOM diagnostic reasoning engine.
    This is where RF chain logic, modem states, ACU behaviour,
    environmental modelling, and structured JSON output are generated.
    """

    # --------------------------------------------------
    # 1. Parse user intent
    # --------------------------------------------------
    intent = "general_satcom_issue"
    if "tx" in user_message.lower():
        intent = "transmit_issue"
    if "rx" in user_message.lower():
        intent = "receive_issue"
    if "lock" in user_message.lower():
        intent = "lock_failure"
    if "acu" in user_message.lower():
        intent = "antenna_control_issue"
    if "modem" in user_message.lower():
        intent = "modem_state_issue"

    # --------------------------------------------------
    # 2. RF Chain Health Scoring (placeholder logic)
    # --------------------------------------------------
    rf_scores = {
        "antenna_pointing": 0.82,
        "modem_state": 0.74,
        "cable_integrity": 0.91,
        "weather_fade": 0.63,
        "satellite_visibility": 0.88
    }

    # --------------------------------------------------
    # 3. Log analysis (if provided)
    # --------------------------------------------------
    log_summary = "No logs provided."
    if log_text:
        if "error" in log_text.lower():
            log_summary = "Errors detected in log stream."
        elif "warning" in log_text.lower():
            log_summary = "Warnings detected in log stream."
        else:
            log_summary = "Logs parsed successfully. No critical faults detected."

    # --------------------------------------------------
    # 4. Recommended Fix (placeholder logic)
    # --------------------------------------------------
    recommended_fix = "Perform ACU re‑pointing and verify modem TX chain."
    if intent == "lock_failure":
        recommended_fix = "Check satellite visibility, verify ACU tracking, and inspect RX chain."
    if intent == "modem_state_issue":
        recommended_fix = "Restart modem, verify carrier acquisition, and check LNB power."
    if intent == "antenna_control_issue":
        recommended_fix = "Inspect ACU gyro, GPS feed, and stabilization motors."

    # --------------------------------------------------
    # 5. Final Summary
    # --------------------------------------------------
    final_summary = (
        f"SATCOM diagnostic completed. Intent: {intent}. "
        f"RF chain scores analysed. Recommended fix provided."
    )

    # --------------------------------------------------
    # 6. Structured JSON Response
    # --------------------------------------------------
    return {
        "intent": intent,
        "logSummary": log_summary,
        "rfChainScores": rf_scores,
        "recommendedFix": recommended_fix,
        "finalSummary": final_summary
    }

# ======================================================
# DIAGNOSE ENDPOINT
# ======================================================
@app.post("/diagnose")
def diagnose(req: SatcomRequest):
    result = run_reasoning_engine(req.message, req.log_text)
    return result

# ======================================================
# RUN SERVER
# ======================================================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
