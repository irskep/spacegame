import { Module } from "vuex";
import { generateStars } from "@/game/exploration/gen/stargen";
import {
  GovtMap,
  GovtSystem,
  Govt,
} from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import {
  StarMetadataMap,
  StarMetadataSystem,
  StarMetadata,
} from "@/game/exploration/gen/StarMetadataSystem";
import { Star } from "@/game/exploration/types/Star";
import { GalaxyState, RootState } from "./types";

const galaxyCache: Record<string, Galaxy> = {};

function getGalaxy(s: string): Galaxy {
  if (galaxyCache[s]) return galaxyCache[s];
  const g = generateStars(s);
  galaxyCache[s] = g;
  return g;
}

const initialSeed = `${Math.random()}`;

export const GalaxyModule: Module<GalaxyState, RootState> = {
  namespaced: true,
  state: {
    seed: initialSeed,
    playerLocationStarID: getGalaxy(initialSeed).homeStarID,
  },
  getters: {
    galaxy: function (state): Galaxy {
      return getGalaxy(state.seed);
    },
    govtMap: function (state): GovtMap {
      return GovtSystem.makeGovts(state.seed, getGalaxy(state.seed));
    },
    metadataMap: function (state): StarMetadataMap {
      return StarMetadataSystem.makeMetadata(state.seed, getGalaxy(state.seed));
    },
    playerStar: function (state): Star | null {
      if (!state.playerLocationStarID) return null;
      return getGalaxy(state.seed).stars[state.playerLocationStarID];
    },
    playerStarGovt: function (state): Govt | null {
      if (!state.playerLocationStarID) return null;
      return GovtSystem.makeGovts(state.seed, getGalaxy(state.seed))[
        state.playerLocationStarID
      ];
    },
    playerStarMetadata: function (state): StarMetadata | null {
      if (!state.playerLocationStarID) return null;
      return StarMetadataSystem.makeMetadataForStar(state.playerLocationStarID);
    },
  },
  actions: {},
  mutations: {
    travel(state, newStarID: string) {
      state.playerLocationStarID = newStarID;
    },
    newRandomSeed(state) {
      state.seed = `${Math.random()}`;
      const g = getGalaxy(state.seed);
      state.playerLocationStarID = g.homeStarID;
    },
  },
};
