import { Module } from "vuex";
import { generateStars } from "@/game/exploration/gen/stargen";
import { GovtSystem } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { StarMetadataSystem } from "@/game/exploration/gen/StarMetadataSystem";
import { GalaxyState, RootState } from "./types";
import { generateExplorer } from "@/game/exploration/gen/explorers";

const CONSTANTS = {
  travelTime: 1000,
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
  actions: {},
  mutations: {
    travel(state, opts: { explorerID: string; newStarID: string }) {
      state.explorers[opts.explorerID].destinationStarID = opts.newStarID;
    },
    tick(state, dt: number) {
      for (const e of Object.values(state.explorers)) {
        if (e.destinationStarID) {
          e.travelProgress = e.travelProgress + dt / CONSTANTS.travelTime;
          if (e.travelProgress >= 1) {
            e.travelProgress = 0;
            e.starID = e.destinationStarID;
            e.destinationStarID = null;
          }
        }
      }
    },
    newRandomSeed,
  },
};
