import Vue from "vue";
import Vuex, { Module } from "vuex";
import VuexPersistence from "vuex-persist";
import { generateStars } from "@/game/stargen";
import { GovtMap, GovtSystem, Govt } from "@/game/govts";
import { Galaxy } from "@/game/Galaxy";

Vue.use(Vuex);

export interface GameState {
  seed: string;
  playerLocationStarID: string | null;
}

export interface RootState {
  game: GameState;
}

const galaxyCache: Record<string, Galaxy> = {};
function getGalaxy(s: string): Galaxy {
  if (galaxyCache[s]) return galaxyCache[s];
  const g = generateStars(s);
  galaxyCache[s] = g;
  return g;
}

const game: Module<GameState, RootState> = {
  namespaced: true,
  state: {
    seed: `${Math.random()}`,
    playerLocationStarID: null,
  },
  getters: {
    galaxy: function (state): Galaxy {
      return getGalaxy(state.seed);
    },
    govtMap: function (state): Record<string, Govt> {
      return GovtSystem.makeGovts(state.seed, getGalaxy(state.seed));
    },
  },
  actions: {},
  mutations: {
    newRandomSeed(state) {
      state.seed = `${Math.random()}`;
      const g = getGalaxy(state.seed);
      state.playerLocationStarID = g.homeStarID;
    },
  },
};

export default new Vuex.Store<RootState>({
  modules: {
    game,
  },
  plugins: [new VuexPersistence().plugin],
});
