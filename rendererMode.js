// rendererMode.js
// AMC Academy Tech AI – Renderer v3 Simple Edition + Minimal + Professional
// Backend-only rendering controller

// -------------------------------------------------------------
// Mode selector
// -------------------------------------------------------------
let currentMode = "minimal"; 
// Options: "simple", "minimal", "professional"

// Allow other backend files to change the mode
function setRendererMode(mode) {
    const allowed = ["simple", "minimal", "professional"];
    if (allowed.includes(mode)) {
        currentMode = mode;
    }
}

// -------------------------------------------------------------
// SIMPLE EDITION (Renderer v3 Simple)
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// MINIMAL EDITION (Renderer v3 Professional Minimal Mode)
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// PROFESSIONAL EDITION (Renderer v3 Professional)
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// MAIN RENDERER ENTRY POINT
// -------------------------------------------------------------
function renderMessage(message) {
    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}

// -------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------
module.exports = {
    setRendererMode,
    renderMessage
};
