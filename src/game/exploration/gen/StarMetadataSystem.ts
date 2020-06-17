import starnames from "@/game/exploration/gen/starnames";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";

export type StarMetadataMap = Record<string, StarMetadata>;

export interface StarMetadata {
  name: string;
}

export const StarMetadataSystem = {
  makeMetadata: function (seed: string, g: Galaxy): StarMetadataMap {
    const metadata: StarMetadataMap = {};
    for (const s of g.heyNow()) {
      metadata[s.id] = StarMetadataSystem.makeMetadataForStar(s.id);
    }
    return metadata;
  },
  makeMetadataForStar: function (sid: string): StarMetadata {
    const rng = new RNG(sid);
    return rng.replaceMathRandom(() => {
      return {
        name: starnames.flatten("#starname#"),
      };
    });
  },
};
