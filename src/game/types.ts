import { Vertex } from "voronoijs";
export type Vector2 = Vertex;

// export interface Star extends Vertex {}
export interface Star {
  id: string;
  point: {
    x: number;
    y: number;
  };
  slots: number[];
}
