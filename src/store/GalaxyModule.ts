import { Module } from "vuex";
import { generateStars } from "@/game/exploration/gen/stargen";
import { GovtSystem } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { StarMetadataSystem } from "@/game/exploration/gen/StarMetadataSystem";
import { GalaxyState, RootState } from "./types";
import { generateExplorer } from "@/game/exploration/gen/explorers";
import { RNG } from "@/game/framework/RNG";
import { tickScan, tickTravel } from "./ticks";

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
    animationHandle: 0,
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
    beginTick(ctx) {
      ctx.dispatch("stopTick");
      if (ctx.state.animationHandle !== 0) return;
      let lastTick = Date.now();
      const exec = () => {
        const now = Date.now();
        const dt = now - lastTick;

        this.commit("galaxy/tick", dt);

        lastTick = now;
        ctx.state.animationHandle = requestAnimationFrame(exec);
      };
      ctx.state.animationHandle = requestAnimationFrame(exec);
    },
    stopTick(ctx) {
      if (ctx.state.animationHandle === 0) return;
      cancelAnimationFrame(ctx.state.animationHandle);
      ctx.state.animationHandle = 0;
    },
  },
  mutations: {
    travel(state, opts: { explorerID: string; newStarID: string }) {
      state.explorers[opts.explorerID].destinationStarID = opts.newStarID;
    },
    tick(state, dt: number) {
      const galaxy = getGalaxy(state.seed);

      for (const e of Object.values(state.explorers)) {
        const oldState = e.state;
        switch (e.state) {
          case "traveling":
            tickTravel(dt, galaxy, e);
            break;
          case "scanning":
            tickScan(dt, galaxy, e);
            break;
        }

        const newState = e.state;
        if (newState != oldState) {
          switch (newState) {
            case "traveling":
              e.destinationStarID = new RNG(`${Math.random()}`).choice(
                galaxy.getNeighborIDs(e.starID)
              );
              e.travelProgress = 0;
              break;
            case "scanning":
              e.destinationStarID = null;
              e.scanProgress = 0;
          }
        }
      }
    },
    newRandomSeed,
  },
};
