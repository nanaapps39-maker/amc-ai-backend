// =====================================================
// Renderer v3.1 — Professional Backend-Only Edition
// AMC Academy Tech AI R&D Labs
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
    return {
        mode: "professional",
        output: message.toString(),
        formatting: {
            markdown: true,
            sections: true,
            spacing: "wide",
            style: "professional",
            layout: {
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

    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}

// =====================================================
// Renderer v3.1 — Backend JSON Wrapper
// AMC Academy Tech AI R&D Labs
// =====================================================

import crypto from "crypto";

export function wrapV31(mode, payload, confidence = 1.0) {
    return {
        renderer_version: "v3.1",
        api_version: "1.0.0",
        mode: mode || "unknown",
        timestamp: new Date().toISOString(),
        session_id: crypto.randomUUID(),
        confidence: typeof confidence === "number" ? confidence : 1.0,
        payload
    };
}

export function validateV31(output) {
    if (!output) throw new Error("Renderer v3.1: output is undefined or null");
    if (output.renderer_version !== "v3.1") throw new Error("Renderer v3.1: invalid renderer_version");
    if (!output.api_version) throw new Error("Renderer v3.1: missing api_version");
    if (!output.mode) throw new Error("Renderer v3.1: missing mode");
    if (!output.payload) throw new Error("Renderer v3.1: missing payload");
    return true;
}

export function buildV31Response(mode, payload, confidence = 1.0) {
    const output = wrapV31(mode, payload, confidence);
    validateV31(output);
    return output;
}
