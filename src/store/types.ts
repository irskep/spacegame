import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataMap } from "@/game/exploration/gen/StarMetadataSystem";
import { Vector2 } from "@/game/framework/Vector2";

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

export type ExplorerState = "traveling" | "scanning";

export type Explorer = TravelerComponent & {
  id: string;
  crew: Crewmate[];
  ship: Ship;
  state: ExplorerState;
  scanProgress: number;
};

export interface PlanetInfo {
  name: string;
  explored: boolean;
}

export interface GalaxyState {
  animationHandle: number;
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
