import { StarSystem } from "stellardream";

import { RNG } from "@/game/framework/RNG";

const starSystemCache: Record<string, StarSystem> = {};
export function generateStarSystem(s: string): StarSystem {
  function score(starSystem: StarSystem): number {
    let result = 0;
    if (starSystem.stars[0].starType === "M") {
      result -= 1; // dwarfs are boring
    }
    if (starSystem.planets.length > 3) {
      result += 1; // lots of planets are cool
    }
    let hasInterestingPlanet = false;
    for (const planet of starSystem.planets) {
      const isCold = planet.distance > starSystem.habitableZoneMax;
      const isHot = planet.distance < starSystem.habitableZoneMin;
      const isTidallyLocked = !isCold && starSystem.stars[0].starType == "M";
      if (!isCold && !isHot && !isTidallyLocked) {
        hasInterestingPlanet = true;
        break;
      }
    }
    if (hasInterestingPlanet) {
      result += 2;
    }
    return result;
  }

  // Generate 100 stars and pick the coolest one
  const rng = new RNG(s);
  let result = new StarSystem(rng.getRandom() * (Number.MAX_SAFE_INTEGER / 4));
  let resultScore = score(result);
  for (let i = 1; i < 100; i++) {
    const candidate = new StarSystem(
      rng.getRandom() * (Number.MAX_SAFE_INTEGER / 4) + i
    );
    const candidateScore = score(candidate);
    if (candidateScore > resultScore) {
      result = candidate;
      resultScore = candidateScore;
    }
  }
  return result;
}

// Stars are globally unique, so no need to make it a getter
export function getStarSystem(s: string): StarSystem {
  if (!starSystemCache[s]) {
    starSystemCache[s] = generateStarSystem(s);
  }
  return starSystemCache[s];
}
