// Galaxy structure types (not game mechanics)

export type StarMetadataMap = Record<string, StarMetadata>;

export type Building = "Colony";

export interface StarMetadata {
  id: string;
  name: string;
  known: boolean;
  explored: boolean;
  buildings: Building[];
  planetIDs: string[];
  exploredPlanetsCount: number;
  hasTerranHabitable: boolean;
}

export type PlanetTemp = "hot" | "cold" | "hab";

export interface PlanetInfo {
  name: string | null;
  known: boolean;
  id: string;
  index: number;
  temp: PlanetTemp;
  type: "Terran" | "Neptunian" | "Jovian";
  isTidallyLocked: boolean;
  isTerranHabitable: boolean;
}

// Re-export types from other files
export type { Vector2 } from "../framework/Vector2";
export type { Govt, GovtMap } from "../gen/StarGovtSystem";
export { Galaxy } from "./Galaxy";
export type { Star } from "./Star";
