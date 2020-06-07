import { Vector2 } from "./types";

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
export function getDoLineSegmentsIntersect(
  a1: Vector2,
  a2: Vector2,
  b1: Vector2,
  b2: Vector2
): boolean {
  // Check if none of the lines are of length 0
  if ((a1.x === a2.x && a1.y === a2.y) || (b1.x === b2.x && b1.y === b2.y)) {
    return false;
  }
  const denominator =
    (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
  // Lines are parallel
  if (denominator === 0) {
    return false;
  }
  const ua =
    ((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) /
    denominator;
  const ub =
    ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) /
    denominator;
  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }
  return true;
  // Return a object with the x and y coordinates of the intersection
  // const x = a1.x + ua * (a2.x - a1.x);
  // const y = a1.y + ua * (a2.y - a1.y);
  // return { x, y };
}
