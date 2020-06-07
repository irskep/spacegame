import Vue from "vue";
import Vuex, { Module } from "vuex";
import VuexPersistence from "vuex-persist";
import { Galaxy, generateStars } from "@/game/stargen";

Vue.use(Vuex);

export interface GameState {
  seed: string;
  playerLocationStarID: string | null;
}

export interface RootState {
  game: GameState;
}

const game: Module<GameState, RootState> = {
  namespaced: true,
  state: {
    seed: `${Math.random()}`,
    playerLocationStarID: null,
  },
  getters: {},
  actions: {},
  mutations: {
    newRandomSeed(state) {
      state.seed = `${Math.random()}`;
      const galaxy = generateStars(state.seed);
      state.playerLocationStarID = galaxy.homeStarID;
    },
  },
};

export default new Vuex.Store<RootState>({
  modules: {
    game,
  },
  plugins: [new VuexPersistence().plugin],
});
