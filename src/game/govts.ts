import { Galaxy } from "./Galaxy";
import { Star } from "./types";
import { RNG } from "./RNG";

export interface Govt {
  name: string;
  color: string;
}

export type GovtMap = Record<string, Govt>;

interface ExploringGovt {
  govt: Govt;
  open: Set<Star>;
  closed: Set<Star>;
}

const COLORS = [
  "#d32f2f",
  "#C2185B",
  "#7B1FA2",
  "#512DA8",
  "#303F9F",
  "#1976D2",
  "#0288D1",
  "#0097A7",
  "#00796B",
  "#388E3C",
  "#689F38",
  "#AFB42B",
  "#FBC02D",
  "#FFA000",
  "#F57C00",
  "#E64A19",
  "#5D4037",
  // "#616161",
  "#455A64",
];

export const GovtSystem = {
  makeGovts: function (seed: string, g: Galaxy, numGovts = 5): GovtMap {
    const rng = new RNG(seed);
    const allStars = rng.shuffled(g.heyNow());
    const colors = rng.shuffled(COLORS).slice(0, numGovts);

    const govts: ExploringGovt[] = colors.map((c) => {
      return {
        govt: { name: c, color: c },
        open: new Set(),
        closed: new Set(),
      };
    });

    const unused = new Set<string>(allStars.map((s) => s.id));
    const vals: GovtMap = {};

    const blockedSourceStars = new Set<string>();
    const possibleSourceStars = new Array<string>();
    for (const s of allStars) {
      if (blockedSourceStars.has(s.id)) continue;
      possibleSourceStars.push(s.id);
      for (const n of g.getNeighbors(s)) {
        blockedSourceStars.add(n.id);
      }
    }

    if (possibleSourceStars.length < numGovts) {
      throw new Error("Can't generate govts");
    }

    for (const s of allStars) {
      vals[s.id] = rng.choice(govts).govt;
    }

    return vals;
  },
};
