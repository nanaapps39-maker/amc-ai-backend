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

    // ⭐ Bypass renderer for structured JSON modes (diagnostics, translator, storage, orbit, vessel-intel, future-trends)
    if (message && typeof message === "object" && message.mode) {
        return message;   // return raw JSON directly
    }

    // ⭐ Otherwise use Renderer v3 modes
    switch (currentMode) {
        case "simple":
            return renderSimple(message);
        case "professional":
            return renderProfessional(message);
        default:
            return renderMinimal(message);
    }
}
