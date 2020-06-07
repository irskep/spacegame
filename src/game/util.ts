import shortUUID from "short-uuid";
import { Vector2 } from "./types";
export const uuid = () => shortUUID().new();
export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
