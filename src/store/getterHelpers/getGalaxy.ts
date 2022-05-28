import { generateStars } from "@/game/exploration/gen/stargen";
import { Galaxy } from "@/game/exploration/types/Galaxy";

const galaxyCache: Record<string, Galaxy> = {};
export function getGalaxy(s: string): Galaxy {
  if (galaxyCache[s]) return galaxyCache[s];
  const g = generateStars(s, 300, { x: 2048, y: 2048 });
  galaxyCache[s] = g;
  return g;
}
