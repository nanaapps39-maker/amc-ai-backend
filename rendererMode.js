// rendererMode.js
let currentMode = "minimal";

export function setRendererMode(mode) {
    const allowed = ["simple", "minimal", "professional"];
    if (allowed.includes(mode)) currentMode = mode;
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
    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}
