/**
 * Atlas state registry — add a new state JSON here when data is ready.
 * status: "live" | "coming"
 */
import tamilNadu from "./tamil-nadu.json";

export const ATLAS_STATES = [
  {
    id: tamilNadu.id ?? 7,
    name: "Tamil Nadu",
    code: "TN",
    status: "live",
    latitude: tamilNadu.latitude ?? 11.1271,
    longitude: tamilNadu.longitude ?? 78.6569,
    visited: true,
    districts: tamilNadu.districts || [],
  },
  // Future states: import JSON and append with status: "live"
  // { id: 1, name: "Gujarat", code: "GJ", status: "coming", latitude: 22.2587, longitude: 71.1924, districts: [] },
];

export function getAtlasStates() {
  return ATLAS_STATES;
}

export function getLiveAtlasStates() {
  return ATLAS_STATES.filter((s) => s.status === "live" && Array.isArray(s.districts) && s.districts.length > 0);
}
