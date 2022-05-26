import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataMap } from "@/game/exploration/gen/StarMetadataSystem";

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

export interface GalaxyState {
  animationHandle: number;
  seed: string;
  starInfo: StarMetadataMap;
  govtInfo: GovtMap;
  explorers: Record<string, Explorer>;
}

export interface UIState {
  hoveredStarID: string | null;
  selectedStarID: string | null;
  selectedExplorerID: string | null;
}

export interface RootState {
  galaxy: GalaxyState;
  ui: UIState;
}
