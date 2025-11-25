import { RNG } from "../framework/RNG";
import { getStarSystem } from "../helpers/starSystems";
import type { StarData, StarDataMap } from "../types";
import type { Galaxy } from "../types/Galaxy";
import starnames from "./starnames";

export const StarDataSystem = {
  makeData: (_seed: string, g: Galaxy): StarDataMap => {
    const data: StarDataMap = {};
    for (const s of g.heyNow()) {
      data[s.id] = StarDataSystem.makeDataForStar(s.id);
    }
    return data;
  },
  makeDataForStar: (sid: string): StarData => {
    const rng = new RNG(sid);
    return rng.replaceMathRandom(() => {
      return {
        id: sid,
        name: starnames.flatten("#starname#"),
        hasTerranHabitable: false, // computed later from planet data
        planetIDs: getStarSystem(sid).planets.map(
          (_p, i) => `planet-${sid}-${i}`,
        ),
      };
    });
  },
};
