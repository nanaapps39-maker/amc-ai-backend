// =====================================================
// Renderer v3 — Professional Backend-Only Edition
// =====================================================

// Default renderer mode
export let currentMode = "minimal"; // can be set to "professional" from backend when needed

// ⭐ NEW — Setter function required for ESM mutation
export function setRendererMode(mode) {
    currentMode = mode;
}

function renderSimple(message) {
    return {
        mode: "simple",
        output: message.toString(),
        formatting: {
            markdown: true,
            sections: false,
            spacing: "compact",
            style: "basic"
        }
    };
}

function renderMinimal(message) {
    return {
        mode: "minimal",
        output: message.toString(),
        formatting: {
            markdown: true,
            sections: true,
            spacing: "medium",
            style: "professional-minimal"
        }
    };
}

// ⭐ Upgraded Professional Renderer (Backend-Only)
function renderProfessional(message) {
    // Backend-only structured formatting – no UI changes
    return {
        mode: "professional",
        output: message.toString(),
        formatting: {
            markdown: true,
            sections: true,
            spacing: "wide",
            style: "professional",
            layout: {
                // purely semantic hints for backend/dashboards
                enableSummaryBlock: true,
                enableKeyPointsBlock: true,
                enableEngineeringDetailBlock: true,
                enableRecommendationsBlock: true,
                enableConfidenceBlock: true
            }
        }
    };
}

export function renderMessage(message) {

    // ⭐ Critical: Bypass renderer for structured JSON modes
    // Protects SATCOM Diagnostics, Translator Mode, Attachment Mode
    if (message && typeof message === "object" && message.mode) {
        return message;
    }

    // ⭐ Renderer v3 modes (backend-only formatting)
    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}

