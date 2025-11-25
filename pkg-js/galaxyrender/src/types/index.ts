import type { Vector2 } from "@spacegame/galaxygen";

export interface Node {
  id: string;
  position: Vector2;
  label?: string;
}

export interface Edge {
  fromNodeID: string;
  toNodeID: string;
}

export interface Traveler {
  id: string;
  image: string;
  nodeID: string;
  destNodeID: string | null;
  progress: number;
}

export interface NodeVisualState {
  selected?: boolean;
  hovered?: boolean;
  borderColor?: string;
  known?: boolean;
}
