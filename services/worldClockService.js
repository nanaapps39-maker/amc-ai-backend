// services/worldClockService.js

export const worldClock = () => new Date().toISOString();

export function getGlobalWorldClock() {
  const now = new Date();

  return {
    utc: now.toISOString(),

    london: now.toLocaleString("en-GB", {
      timeZone: "Europe/London"
    }),

    accra: now.toLocaleString("en-GB", {
      timeZone: "Africa/Accra"
    }),

    dubai: now.toLocaleString("en-GB", {
      timeZone: "Asia/Dubai"
    }),

    singapore: now.toLocaleString("en-GB", {
      timeZone: "Asia/Singapore"
    }),

    tokyo: now.toLocaleString("en-GB", {
      timeZone: "Asia/Tokyo"
    }),

    newYork: now.toLocaleString("en-US", {
      timeZone: "America/New_York"
    })
  };
}