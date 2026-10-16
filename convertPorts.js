import fs from "fs";
import csv from "csv-parser";

// Convert UN/LOCODE coordinate format "DDMMN" or "DDDMME" → decimal degrees
function convertSingleCoord(coord) {
  if (!coord || coord.length < 4) return null;

  const hemi = coord.slice(-1); // N/S/E/W
  const body = coord.slice(0, -1);

  const deg = parseInt(body.length === 4 ? body.slice(0, 2) : body.slice(0, 3));
  const min = parseInt(body.length === 4 ? body.slice(2) : body.slice(3));

  if (Number.isNaN(deg) || Number.isNaN(min)) return null;

  let decimal = deg + (min / 60);
  if (hemi === "S" || hemi === "W") decimal *= -1;

  return decimal;
}

// Parse "DDMMN DDDMME" → { lat, lon }
function parseCoordinates(coordField) {
  if (!coordField) return { lat: null, lon: null };

  const parts = coordField.split(" ");
  if (parts.length !== 2) return { lat: null, lon: null };

  return {
    lat: convertSingleCoord(parts[0]),
    lon: convertSingleCoord(parts[1])
  };
}

const files = [
  "./data/UNLOCODE CodeListPart1.csv",
  "./data/UNLOCODE CodeListPart2.csv",
  "./data/UNLOCODE CodeListPart3.csv"
];

let ports = [];
let filesProcessed = 0;

function processFile(path) {
  fs.createReadStream(path)
    .pipe(csv({ headers: false }))
    .on("data", (row) => {
      try {
        const country = row[0];
        const locode = row[1];
        const name = row[2];
        const functionCode = row[5];
        const coordField = row[8] || row[9] || row[10];

        // Skip metadata rows
        if (!locode || locode.length !== 3) return;

        // Seaport: any "1" in function code
        if (!functionCode || !functionCode.includes("1")) return;

        if (!coordField) return;

        const { lat, lon } = parseCoordinates(coordField);
        if (!lat || !lon) return;

        ports.push({
          portName: name,
          country,
          unlocode: country + locode,
          lat,
          lon
        });
      } catch (err) {
        console.error("Row error:", err);
      }
    })
    .on("end", () => {
      filesProcessed++;
      if (filesProcessed === files.length) {
        fs.writeFileSync("./data/worldPorts.json", JSON.stringify(ports, null, 2));
        console.log(`✔ Conversion complete. Total seaports: ${ports.length}`);
      }
    });
}

files.forEach(processFile);


