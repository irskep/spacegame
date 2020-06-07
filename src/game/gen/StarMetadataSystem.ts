import starnames from "./starnames";
import { Galaxy } from "../types/Galaxy";
import { RNG } from "../framework/RNG";

export type StarMetadataMap = Record<string, StarMetadata>;

export interface StarMetadata {
  name: string;
}

function replaceMathRandom<T>(rng: () => number, fn: () => T): T {
  const r = Math.random;
  Math.random = rng;
  const val = fn();
  Math.random = r;
  return val;
}

export const StarMetadataSystem = {
  makeMetadata: function (seed: string, g: Galaxy): StarMetadataMap {
    const metadata: StarMetadataMap = {};
    for (const s of g.heyNow()) {
      const rng = new RNG(s.id);
      rng.replaceMathRandom(() => {
        metadata[s.id] = {
          name: starnames.flatten("#starname#"),
        };
      });
    }
    return metadata;
  },
};
