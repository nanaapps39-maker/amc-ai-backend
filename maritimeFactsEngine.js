// =====================================================
// AMC Academy Tech AI R&D Labs
// Maritime Facts Validation Engine
// Verified Maritime Intelligence Layer
// =====================================================

import fs from "fs";

const worldPorts = JSON.parse(
    fs.readFileSync("./data/worldPorts.json", "utf8")
);

// -----------------------------------------------------
// Haversine Distance Engine
// -----------------------------------------------------
function haversine(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );
}

// -----------------------------------------------------
// Bearing Engine
// -----------------------------------------------------
function calculateBearing(origin, destination) {

    const lat1 =
        origin.lat * Math.PI / 180;

    const lat2 =
        destination.lat * Math.PI / 180;

    const dLon =
        (destination.lon - origin.lon) *
        Math.PI / 180;

    const y =
        Math.sin(dLon) *
        Math.cos(lat2);

    const x =
        Math.cos(lat1) *
        Math.sin(lat2) -
        Math.sin(lat1) *
        Math.cos(lat2) *
        Math.cos(dLon);

    return (
        Math.atan2(y, x) *
        180 / Math.PI +
        360
    ) % 360;
}

// -----------------------------------------------------
// Route Facts Validator
// -----------------------------------------------------
export function getVerifiedRouteFacts(
    originCode,
    destinationCode
) {

    const origin =
        worldPorts.find(
            p =>
                p.unlocode ===
                originCode.toUpperCase()
        );

    const destination =
        worldPorts.find(
            p =>
                p.unlocode ===
                destinationCode.toUpperCase()
        );

    if (!origin || !destination) {

        return {
            verified: false,
            error: "Port not found"
        };

    }

    const distanceKm =
        haversine(
            origin.lat,
            origin.lon,
            destination.lat,
            destination.lon
        );

    const distanceNm =
        distanceKm / 1.852;

    const bearing =
        calculateBearing(
            origin,
            destination
        );

    return {

        verified: true,

        source: {
             engine:
               "AMC Academy Tech AI Maritime Facts Engine",

             dataset:
               "worldPorts.json",

             method:
               "Haversine + Bearing",

            version:
               "1.0.0",

            verified:
               true,

            generatedAt:
                 new Date().toISOString()
         },

        origin,
        destination,

        distanceKm:
            Number(distanceKm.toFixed(2)),

        distanceNm:
            Number(distanceNm.toFixed(2)),

        bearing:
            Number(bearing.toFixed(2)),

        eta: {
            speed12kt:
                Number(
                    ((distanceNm / 12) / 24)
                    .toFixed(2)
                ),

            speed15kt:
                Number(
                    ((distanceNm / 15) / 24)
                    .toFixed(2)
                ),

            speed18kt:
                Number(
                    ((distanceNm / 18) / 24)
                    .toFixed(2)
                )
        }
    };
}