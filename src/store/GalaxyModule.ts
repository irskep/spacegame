import { Module } from "vuex";
import { generateStars } from "@/game/exploration/gen/stargen";
import { GovtSystem } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { StarMetadataSystem } from "@/game/exploration/gen/StarMetadataSystem";
import { GalaxyState, RootState } from "./types";
import { generateExplorer } from "@/game/exploration/gen/explorers";
import { RNG } from "@/game/framework/RNG";
import { distance } from "@/game/framework/util";

const CONSTANTS = {
  travelTime: 10000,
};

const galaxyCache: Record<string, Galaxy> = {};

function getGalaxy(s: string): Galaxy {
  if (galaxyCache[s]) return galaxyCache[s];
  const g = generateStars(s);
  galaxyCache[s] = g;
  return g;
}

function newRandomSeed(state: GalaxyState): GalaxyState {
  state.seed = `${Math.random()}`;
  const g = getGalaxy(state.seed);
  state.starInfo = StarMetadataSystem.makeMetadata(state.seed, g);
  state.govtInfo = GovtSystem.makeGovts(state.seed, getGalaxy(state.seed));
  state.explorers = {};
  for (let i = 0; i < 5; i++) {
    const e = generateExplorer(g.homeStarID);
    state.explorers[e.id] = e;
  }
  return state;
}

export const GalaxyModule: Module<GalaxyState, RootState> = {
  namespaced: true,
  state: newRandomSeed({
    seed: "0",
    starInfo: {},
    govtInfo: {},
    explorers: {},
  }),
  getters: {
    galaxy: function (state): Galaxy {
      console.log("Galaxy for", state.seed);
      return getGalaxy(state.seed);
    },
  },
  actions: {
    beginTick() {
      let lastTick = Date.now();
      const exec = () => {
        const now = Date.now();
        const dt = now - lastTick;

        this.commit("galaxy/tick", dt);

        lastTick = now;
        requestAnimationFrame(exec);
      };
      requestAnimationFrame(exec);
    },
  },
  mutations: {
    travel(state, opts: { explorerID: string; newStarID: string }) {
      state.explorers[opts.explorerID].destinationStarID = opts.newStarID;
    },
    tick(state, dt: number) {
      const galaxy = getGalaxy(state.seed);

      for (const e of Object.values(state.explorers)) {
        if (e.destinationStarID) {
          const srcStar = galaxy.stars[e.starID];
          const destStar = galaxy.stars[e.destinationStarID];
          const starDist = distance(srcStar.point, destStar.point);

          const speedFactor = 50 / starDist;

          e.travelProgress += (dt * speedFactor) / CONSTANTS.travelTime;
          if (e.travelProgress >= 1) {
            e.travelProgress = 0;
            e.starID = e.destinationStarID;
            e.destinationStarID = null;
          }
        }

        if (!e.destinationStarID) {
          e.destinationStarID = new RNG(`${Math.random()}`).choice(
            galaxy.getNeighborIDs(e.starID)
          );
          e.travelProgress = 0;
        }
      }
    },
    newRandomSeed,
  },
};
