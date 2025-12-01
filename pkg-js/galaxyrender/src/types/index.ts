import type { Vector2 } from "@spacegame/galaxygen";
import type { Star } from "stellardream";

export interface Node {
  id: string;
  position: Vector2;
  label?: string;
  star?: Star;
}

export interface Edge {
  fromNodeID: string;
  toNodeID: string;
}

export interface Traveler {
  id: string;
  label: string;
  imageURL: string;
  nodeID: string;
  destNodeID: string | null;
  progress: number;
}

export type ExplorationLevel =
  | "undiscovered"
  | "discovered"
  | "starExplored"
  | "systemExplored";

export type NodeAnnotation =
  | { type: "background"; color: string }
  | { type: "pulse"; color?: string };

export interface NodeVisualState {
  selected?: boolean;
  hovered?: boolean;
  exploration?: ExplorationLevel;
  annotations?: NodeAnnotation[];
}
