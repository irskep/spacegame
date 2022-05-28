import { GalaxyState } from "@/store/types";
import { Planet, StarSystem } from "stellardream";
import { Galaxy } from "./Galaxy";

type StarExplorationState = "None" | "Some" | "All";

export function getStarExplorationState(
  state: GalaxyState,
  galaxy: Galaxy,
  starID: string
) {
  const info = state.starInfo[starID];
  if (!info.known || !info.explored) return "None";

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    const neighborInfo = state.starInfo[neighborID];
    if (!neighborInfo.known) return "Some";
  }

  return "All";
}

export interface PlanetFacts {
  isHot: boolean;
  isCold: boolean;
  isTidallyLocked: boolean;
  hab: boolean;
}

export interface StarSystemFacts {
  hasHabitablePlanet: boolean;
}

export function getPlanetFacts(
  starSystem: StarSystem,
  planet: Planet
): PlanetFacts {
  const isCold = planet.distance > starSystem.habitableZoneMax;
  const isHot = planet.distance < starSystem.habitableZoneMin;
  const isTidallyLocked = !isCold && starSystem.stars[0].starType == "M";
  const hab =
    !isHot && !isCold && !isTidallyLocked && planet.planetType === "Terran";
  return {
    isHot,
    isCold,
    isTidallyLocked,
    hab,
  };
}

export function getStarSystemFacts(starSystem: StarSystem): StarSystemFacts {
  let hasHabitablePlanet = false;
  for (const p of starSystem.planets) {
    if (getPlanetFacts(starSystem, p).hab) {
      hasHabitablePlanet = true;
      break;
    }
  }
  return { hasHabitablePlanet };
}
