// utils/satcomTerminologyValidator.js

const SATCOM_TERMS = {

    GX: {
        officialName: "Global Xpress",
        provider: "Inmarsat",
        orbit: "GEO",
        description:
            "Inmarsat Global Xpress Ka-band satellite service."
    },

    FleetXpress: {
        officialName: "Fleet Xpress",
        provider: "Inmarsat",
        orbit: "GEO + L-Band",
        description:
            "Fleet Xpress combines Global Xpress with FleetBroadband backup."
    },

    FleetBroadband: {
        officialName: "FleetBroadband",
        provider: "Inmarsat",
        orbit: "GEO",
        description:
            "L-band maritime communications service."
    },

    OneWeb: {
        officialName: "OneWeb",
        orbit: "LEO",
        description:
            "Low Earth Orbit broadband constellation."
    },

    StarlinkMaritime: {
        officialName: "Starlink Maritime",
        orbit: "LEO",
        description:
            "Low Earth Orbit broadband maritime service."
    }
};

export function validateSatcomTerm(term) {
    return SATCOM_TERMS[term] || null;
}

export default SATCOM_TERMS;