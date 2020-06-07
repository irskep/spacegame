import { getDoLineSegmentsIntersect } from "./getDoLineSegmentsIntersect";
import { Vector2, Star } from "./types";
import { distance } from "./util";
import { MIN_STAR_SPACE } from "./stargen";

export class Galaxy {
  stars: Record<string, Star> = {};
  neighbors: Record<string, [string, string]> = {};
  size: Vector2;
  homeStarID!: string;
  constructor(size: Vector2) {
    this.size = size;
  }
  addStar(s: Star) {
    if (!this.homeStarID) {
      this.homeStarID = s.id;
    }
    this.stars[s.id] = s;
  }
  getAllNeighbors(): [Star, Star][] {
    return Object.values(this.neighbors).map((v) => [
      this.stars[v[0]],
      this.stars[v[1]],
    ]);
  }
  getIsNewPointAllowed(p: Vector2): boolean {
    // out of bounds?
    if (
      p.x < 10 ||
      p.y < 10 ||
      p.x > this.size.x - 10 ||
      p.y > this.size.y - 10
    ) {
      return false;
    }
    // too close to another star?
    for (const id in this.stars) {
      if (distance(this.stars[id].point, p) < MIN_STAR_SPACE) {
        return false;
      }
    }
    return true;
  }
  getIsConnectionAllowed(s1: Star, s2: Star): boolean {
    for (const [s3, s4] of this.getAllNeighbors()) {
      if (s1 === s3 || s1 === s4 || s2 === s3 || s2 === s4) continue;
      if (getDoLineSegmentsIntersect(s1.point, s2.point, s3.point, s4.point)) {
        return false;
      }
    }
    return true;
  }
  /* connections */
  private _canonicalize(a: string, b: string): string {
    if (a.localeCompare(b) < 0) {
      return `${a}-${b}`;
    } else {
      return `${b}-${a}`;
    }
  }
  getIsConnected(a: string, b: string) {
    return this.neighbors[this._canonicalize(a, b)];
  }
  connect(a: string, b: string) {
    this.neighbors[this._canonicalize(a, b)] = [a, b];
  }
  unconnect(a: string, b: string) {
    delete this.neighbors[this._canonicalize(a, b)];
  }
}
