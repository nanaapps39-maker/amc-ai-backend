// =====================================================
// Renderer v3 — Simple Edition (with JSON bypass)
// =====================================================

// Default renderer mode
export let currentMode = "minimal";

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

function renderProfessional(message) {
    return {
        mode: "professional",
        output: message.toString(),
        formatting: {
            markdown: true,
            sections: true,
            spacing: "wide",
            style: "professional"
        }
    };
}

export function renderMessage(message) {

    // ⭐ Bypass renderer for structured JSON modes
    if (message && typeof message === "object" && message.mode) {
        return message;
    }

    // ⭐ Renderer v3 modes
    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}
