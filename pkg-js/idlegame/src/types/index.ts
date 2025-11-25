import type {
  GovtMap,
  PlanetData,
  PlanetDataMap,
  StarData,
  StarDataMap,
  Vector2,
} from "@spacegame/galaxygen";

// Game state types (overlays on top of pure generation data)

export type Building = "science_outpost" | "communication_relay";

export interface StarState {
  known: boolean;
  explored: boolean;
  buildings: Building[];
  exploredPlanetsCount: number;
}

export type StarStateMap = Record<string, StarState>;

export interface PlanetState {
  known: boolean;
  name: string | null; // player-assigned name
}

export type PlanetStateMap = Record<string, PlanetState>;

// Combined view types (for convenience in components)

export type StarInfo = StarData & StarState;
export type StarInfoMap = Record<string, StarInfo>;

export type PlanetInfo = PlanetData & PlanetState;
export type PlanetInfoMap = Record<string, PlanetInfo>;

// Explorer-related types (game mechanics, not galaxy structure)

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

// App state types

export interface GalaxyState {
  animationHandle: number;
  timerHandle: number;
  messages: string[];
  lowPowerMode: boolean;

  seed: string;

  // Pure generation data (from galaxygen)
  starData: StarDataMap;
  planetData: PlanetDataMap;
  govtInfo: GovtMap;

  // Game state overlay
  starState: StarStateMap;
  planetState: PlanetStateMap;

  // Combined views (derived)
  starInfo: StarInfoMap;
  planetInfo: PlanetInfoMap;

  explorers: Record<string, Explorer>;
}

export interface UIState {
  hoveredStarID: string | null;
  selectedStarID: string | null;
  hoveredExplorerID: string | null;
  selectedExplorerID: string | null;
  imageSizes: Record<string, Vector2>;
}
