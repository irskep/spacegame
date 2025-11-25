import { Vector2 } from "@/game/framework/Vector2";

export interface Star {
  id: string;
  point: Vector2;
  slots: number[];
}
