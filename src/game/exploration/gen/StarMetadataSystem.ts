import starnames from "@/game/exploration/gen/starnames";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";

export type StarMetadataMap = Record<string, StarMetadata>;

export type Building = "Colony";

export interface StarMetadata {
  name: string;
  known: boolean;
  explored: boolean;
  buildings: Building[];
}

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
        name: starnames.flatten("#starname#"),
        known: false,
        explored: false,
        buildings,
      };
    });
  },
};
