import { RNG } from "../framework/RNG";
import { getStarSystem } from "../helpers/starSystems";
import type { Building, StarMetadata, StarMetadataMap } from "../types";
import type { Galaxy } from "../types/Galaxy";
import starnames from "./starnames";

export const StarMetadataSystem = {
  makeMetadata: (_seed: string, g: Galaxy): StarMetadataMap => {
    const metadata: StarMetadataMap = {};
    for (const s of g.heyNow()) {
      metadata[s.id] = StarMetadataSystem.makeMetadataForStar(
        s.id,
        g.homeStarID === s.id ? ["Colony"] : [],
      );
    }
    return metadata;
  },
  makeMetadataForStar: (
    sid: string,
    buildings: Building[] = [],
  ): StarMetadata => {
    const rng = new RNG(sid);
    return rng.replaceMathRandom(() => {
      return {
        id: sid,
        name: starnames.flatten("#starname#"),
        exploredPlanetsCount: 0,
        known: false,
        explored: false,
        hasTerranHabitable: false, // will fill in later
        buildings,
        planetIDs: getStarSystem(sid).planets.map(
          (_p, i) => `planet-${sid}-${i}`,
        ),
      };
    });
  },
};
