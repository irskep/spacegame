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
  count: number;
  open: Array<string>;
  closed: Array<string>;
}

const COLORS = [
  "#d32f2f",
  // "#C2185B",
  "#7B1FA2",
  // "#512DA8",
  // "#303F9F",
  // "#1976D2",
  "#0288D1",
  // "#0097A7",
  // "#00796B",
  // "#388E3C",
  "#689F38",
  // "#AFB42B",
  "#FBC02D",
  // "#FFA000",
  "#F57C00",
  // "#E64A19",
  // "#5D4037",
  // "#616161",
  // "#455A64",
];

export const GovtSystem = {
  makeGovts: function (seed: string, g: Galaxy, numGovts = 5): GovtMap {
    const rng = new RNG(seed);
    const allStars = rng.shuffled(g.heyNow());
    const colors = rng.shuffled(COLORS).slice(0, numGovts);

    const govts: ExploringGovt[] = colors.map((c) => {
      return {
        govt: { name: c, color: c },
        count: 0,
        open: [],
        closed: [],
      };
    });

    const unused = new Set<string>(allStars.map((s) => s.id));
    const govtMap: GovtMap = {};

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

    for (let i = 0; i < govts.length; i++) {
      const sid = possibleSourceStars[i];
      unused.delete(sid);

      govtMap[sid] = govts[i].govt;
      govts[i].closed.push(sid);
      govts[i].count = 1;
      for (const snid of g.getNeighborIDs(sid)) {
        govts[i].open.push(snid);
      }
    }

    let govtIx = 0;
    let iters = 0;
    while (unused.size && iters < allStars.length * 10) {
      iters += 1;
      const govt = govts[govtIx];
      if (govt.open.length) {
        rng.shuffle(govt.open);
        const sid = govt.open.pop()!;

        if (!govtMap[sid]) {
          unused.delete(sid);
          govt.count += 1;
          govt.closed.push(sid);
          govtMap[sid] = govt.govt;
          for (const snid of g.getNeighborIDs(sid)) {
            govt.open.push(snid);
          }
        }
      }

      govtIx = (govtIx + 1) % govts.length;
    }

    for (const govt of govts) {
      if (govt.count < 5 || govt.count < allStars.length / (numGovts * 3)) {
        console.log("Reroll govts");
        return GovtSystem.makeGovts(seed + "-reroll", g, numGovts);
      }
    }

    return govtMap;
  },
};
