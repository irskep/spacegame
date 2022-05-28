import { Module } from "vuex";

import { Galaxy } from "@/game/exploration/types/Galaxy";
import { GalaxyState, RootState } from "./types";
import { NEXTS, STARTS, TICKS } from "./mutationHelpers/ticks";
import { getGalaxy } from "./getterHelpers/getGalaxy";
import { newRandomSeed } from "./mutationHelpers/newRandomSeed";

export const GalaxyModule: Module<GalaxyState, RootState> = {
  namespaced: true,
  state: {
    animationHandle: 0,
    messages: [],
    lowPowerMode: false,
    seed: "0",
    starInfo: {},
    govtInfo: {},
    planetInfo: {},
    explorers: {},
  },
  getters: {
    galaxy: function (state): Galaxy {
      console.log("Galaxy for", state.seed);
      return getGalaxy(state.seed);
    },
  },
  actions: {
    beginTick(ctx) {
      ctx.dispatch("stopTick");
      console.log("RESUME");
      if (ctx.state.animationHandle !== 0) return;
      let lastTime: number | null = null;
      const exec = (t: number) => {
        ctx.state.animationHandle = requestAnimationFrame(exec);
        if (!lastTime) {
          lastTime = t;
          return;
        }
        const dt = t - lastTime;
        this.commit("galaxy/tick", dt / 1000);
        lastTime = t;
      };
      ctx.state.animationHandle = requestAnimationFrame(exec);
    },
    stopTick(ctx) {
      if (ctx.state.animationHandle === 0) return;
      console.log("PAUSE");
      cancelAnimationFrame(ctx.state.animationHandle);
      ctx.state.animationHandle = 0;
    },
  },
  mutations: {
    ensureSeeded(state) {
      if (state.seed === "0") {
        newRandomSeed(state);
      }
    },
    tick(state, dt: number) {
      const galaxy = getGalaxy(state.seed);

      for (const e of Object.values(state.explorers)) {
        TICKS[e.state](dt, state, galaxy, e);

        const nextState = NEXTS[e.state](dt, state, galaxy, e);
        if (nextState) {
          e.state = nextState;
          STARTS[e.state](dt, state, galaxy, e);
        }
      }
    },
    newRandomSeed,
  },
};
