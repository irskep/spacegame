// Pure generation types - no game state

export type StarDataMap = Record<string, StarData>;

export interface StarData {
  id: string;
  name: string;
  planetIDs: string[];
  hasTerranHabitable: boolean;
}

export type PlanetTemp = "hot" | "cold" | "hab";

export interface PlanetData {
  id: string;
  index: number;
  temp: PlanetTemp;
  type: "Terran" | "Neptunian" | "Jovian";
  isTidallyLocked: boolean;
  isTerranHabitable: boolean;
}

export type PlanetDataMap = Record<string, PlanetData>;

// Re-export types from other files
export type { Vector2 } from "../framework/Vector2";
export type { Govt, GovtMap } from "../gen/StarGovtSystem";
export { Galaxy } from "./Galaxy";
export type { Star } from "./Star";
