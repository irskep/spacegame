import starnames from "@/game/exploration/gen/starnames";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";
import { getStarSystem } from "@/store/getterHelpers/starSystems";
import { Building, StarMetadata, StarMetadataMap } from "@/store/types";

export const StarMetadataSystem = {
  makeMetadata: function (seed: string, g: Galaxy): StarMetadataMap {
    const metadata: StarMetadataMap = {};
    for (const s of g.heyNow()) {
      metadata[s.id] = StarMetadataSystem.makeMetadataForStar(
        s.id,
        g.homeStarID === s.id ? ["Colony"] : []
      );
    }
    return metadata;
  },
  makeMetadataForStar: function (
    sid: string,
    buildings: Building[] = []
  ): StarMetadata {
    const rng = new RNG(sid);
    return rng.replaceMathRandom(() => {
      return {
        id: sid,
        name: starnames.flatten("#starname#"),
        known: false,
        explored: false,
        hasTerranHabitable: false, // will fill in later
        buildings,
        planetIDs: getStarSystem(sid).planets.map(
          (p, i) => `planet-${sid}-${i}`
        ),
      };
    });
  },
};
