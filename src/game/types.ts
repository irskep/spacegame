export interface Vector2 {
  x: number;
  y: number;
}

export interface Star {
  id: string;
  point: Vector2;
  slots: number[];
}
