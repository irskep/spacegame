import { Module } from "vuex";
import { UIState, RootState } from "./types";

export const UIModule: Module<UIState, RootState> = {
  namespaced: true,
  state: {
    hoveredStarID: null,
    selectedStarID: null,
    selectedExplorerID: null,
  },
  getters: {},
  actions: {},
  mutations: {
    hoverStar(state, starID: string | null) {
      state.hoveredStarID = starID;
    },
    selectStar(state, starID: string | null) {
      state.selectedStarID = starID;
    },
    selectExplorer(state, explorerID: string | null) {
      state.selectedExplorerID = explorerID;
    },
  },
};
