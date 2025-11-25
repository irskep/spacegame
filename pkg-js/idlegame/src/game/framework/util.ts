import { Vector2 } from "@/game/framework/Vector2";

export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function add(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function multScalar(a: Vector2, val: number): Vector2 {
  return { x: a.x * val, y: a.y * val };
}

export function lerp(a: Vector2, b: Vector2, fraction: number): Vector2 {
  return add(multScalar(sub(b, a), fraction), a);
}
