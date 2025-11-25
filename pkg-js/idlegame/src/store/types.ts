import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { Vector2 } from "@/game/framework/Vector2";

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

export interface TravelerComponent {
  name: string;
  starID: string;
  destinationStarID: string | null;
  travelProgress: number;
}

export interface Crewmate {
  id: string;
  name: string;
  role: string;
}

export interface Ship {
  id: string;
  kind: string;
  image: string;
}

export interface Scannable {
  scanTimeFactor: number;
  text: string;
  targetID: string;
  kind: "star" | "planet";
}

export type ExplorerState = "traveling" | "scanning";

export type Explorer = TravelerComponent & {
  id: string;
  crew: Crewmate[];
  ship: Ship;
  state: ExplorerState;
  scanProgress: number;
  scannable: Scannable | null;
};

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

export interface GalaxyState {
  animationHandle: number;
  timerHandle: number;
  messages: string[];
  lowPowerMode: boolean;

  seed: string;

  starInfo: StarMetadataMap;
  govtInfo: GovtMap;
  planetInfo: Record<string, PlanetInfo>;
  explorers: Record<string, Explorer>;
}

export interface UIState {
  hoveredStarID: string | null;
  selectedStarID: string | null;
  hoveredExplorerID: string | null;
  selectedExplorerID: string | null;
  imageSizes: Record<string, Vector2>;
}

export interface RootState {
  galaxy: GalaxyState;
  ui: UIState;
}
