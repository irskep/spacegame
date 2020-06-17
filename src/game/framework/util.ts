import { Vector2 } from "@/game/framework/Vector2";

export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
