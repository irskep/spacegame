import {
  type Galaxy,
  type GovtMap,
  GovtSystem,
  getStarSystem,
  type PlanetDataMap,
  type PlanetTemp,
  type StarDataMap,
  StarDataSystem,
} from "@spacegame/galaxygen";

const ENABLE_PERSISTENCE = false;

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { generateExplorer } from "@/game/explorers";
import { getGalaxy } from "@/store/getterHelpers/getGalaxy";
import { NEXTS, STARTS, TICKS } from "@/store/mutationHelpers/ticks";
import type {
  Explorer,
  GalaxyState,
  PlanetInfoMap,
  PlanetStateMap,
  StarInfoMap,
  StarStateMap,
} from "@/types";

export const useGalaxyStore = defineStore(
  "galaxy",
  () => {
    // State
    const animationHandle = ref(0);
    const timerHandle = ref(0);
    const messages = ref<string[]>([]);
    const lowPowerMode = ref(true);
    const seed = ref("0");

    // Pure generation data (from galaxygen)
    const starData = ref<StarDataMap>({});
    const planetData = ref<PlanetDataMap>({});
    const govtInfo = ref<GovtMap>({});

    // Game state overlay
    const starState = ref<StarStateMap>({});
    const planetState = ref<PlanetStateMap>({});

    const explorers = ref<Record<string, Explorer>>({});

    // Getters
    const galaxy = computed<Galaxy>(() => {
      return getGalaxy(seed.value);
    });

    // Combined views that merge data + state
    const starInfo = computed<StarInfoMap>(() => {
      const result: StarInfoMap = {};
      for (const [id, data] of Object.entries(starData.value)) {
        const state = starState.value[id];
        if (state) {
          result[id] = { ...data, ...state };
        }
      }
      return result;
    });

    const planetInfo = computed<PlanetInfoMap>(() => {
      const result: PlanetInfoMap = {};
      for (const [id, data] of Object.entries(planetData.value)) {
        const state = planetState.value[id];
        if (state) {
          result[id] = { ...data, ...state };
        }
      }
      return result;
    });

    // Helper to get current state object (for compatibility with existing helpers)
    function getState(): GalaxyState {
      return {
        animationHandle: animationHandle.value,
        timerHandle: timerHandle.value,
        messages: messages.value,
        lowPowerMode: lowPowerMode.value,
        seed: seed.value,
        starData: starData.value,
        planetData: planetData.value,
        govtInfo: govtInfo.value,
        starState: starState.value,
        planetState: planetState.value,
        starInfo: starInfo.value,
        planetInfo: planetInfo.value,
        explorers: explorers.value,
      };
    }

    // Actions
    function newRandomSeed() {
      seed.value = `${Math.random()}`;
      const g = getGalaxy(seed.value);

      // Generate pure data from galaxygen
      starData.value = StarDataSystem.makeData(seed.value, g);
      govtInfo.value = GovtSystem.makeGovts(seed.value, g);
      explorers.value = {};

      // Initialize star state
      const newStarState: StarStateMap = {};
      for (const starID of Object.keys(starData.value)) {
        newStarState[starID] = {
          known: false,
          explored: false,
          buildings: [],
          exploredPlanetsCount: 0,
        };
      }
      starState.value = newStarState;

      // Generate explorers
      for (let i = 0; i < 5; i++) {
        const e = generateExplorer(
          g.homeStarID,
          Object.values(explorers.value).map((e) => e.name),
        );
        explorers.value[e.id] = e;
      }

      // Set initial known/explored state for home star and neighbors
      starState.value[g.homeStarID].known = true;
      starState.value[g.homeStarID].explored = true;
      for (const neighborID of g.getNeighborIDs(g.homeStarID)) {
        starState.value[neighborID].known = true;
      }

      // Generate planet data and state
      const newPlanetData: PlanetDataMap = {};
      const newPlanetState: PlanetStateMap = {};

      for (const star of Object.values(g.stars)) {
        const sys = getStarSystem(star.id);
        const sd = starData.value[star.id];

        sd.planetIDs.forEach((planetID, i) => {
          const planet = sys.planets[i];
          let temp: PlanetTemp = "cold";
          if (planet.distance > sys.habitableZoneMax) {
            temp = "cold";
          } else if (planet.distance < sys.habitableZoneMin) {
            temp = "hot";
          } else {
            temp = "hab";
          }
          const isTidallyLocked =
            temp !== "cold" && sys.stars[0].starType === "M";
          const isTerranHabitable =
            temp === "hab" &&
            !isTidallyLocked &&
            planet.planetType === "Terran";

          // Pure generation data
          newPlanetData[planetID] = {
            id: planetID,
            index: i,
            temp,
            type: planet.planetType,
            isTidallyLocked,
            isTerranHabitable,
          };

          // Game state
          newPlanetState[planetID] = {
            known: star.id === g.homeStarID,
            name: null,
          };

          // Update star data with hasTerranHabitable
          if (isTerranHabitable) {
            sd.hasTerranHabitable = true;
          }
        });
      }

      planetData.value = newPlanetData;
      planetState.value = newPlanetState;
    }

    function ensureSeeded() {
      if (seed.value === "0") {
        newRandomSeed();
      }
    }

    function tick(dt: number) {
      const g = galaxy.value;
      const state = getState();

      for (const e of Object.values(explorers.value)) {
        TICKS[e.state](dt, state, g, e);

        const nextState = NEXTS[e.state](dt, state, g, e);
        if (nextState) {
          e.state = nextState;
          STARTS[e.state](dt, state, g, e);
        }
      }

      // Sync state back (mutations in tick handlers modify state object)
      messages.value = state.messages;
      starState.value = state.starState;
      planetState.value = state.planetState;
    }

    function beginTick() {
      stopTick();
      console.log("RESUME");
      if (animationHandle.value !== 0) return;

      let lastTime: number | null = null;
      const exec = (t: number) => {
        if (lowPowerMode.value) {
          timerHandle.value = window.setTimeout(() => {
            timerHandle.value = requestAnimationFrame(exec);
          }, 1000 / 15);
        } else {
          animationHandle.value = requestAnimationFrame(exec);
        }

        if (!lastTime) {
          lastTime = t;
          return;
        }
        const dt = t - lastTime;
        tick(dt / 1000);
        lastTime = t;
      };
      animationHandle.value = requestAnimationFrame(exec);
    }

    function stopTick() {
      if (animationHandle.value === 0 && timerHandle.value === 0) return;
      console.log("PAUSE");
      if (animationHandle.value) {
        cancelAnimationFrame(animationHandle.value);
      }
      if (timerHandle.value) {
        clearTimeout(timerHandle.value);
      }
      animationHandle.value = 0;
      timerHandle.value = 0;
    }

    function starSystemPlanets(sid: string) {
      return starData.value[sid].planetIDs.map((pid) => planetInfo.value[pid]);
    }

    return {
      // State
      animationHandle,
      timerHandle,
      messages,
      lowPowerMode,
      seed,
      // Pure generation data
      starData,
      planetData,
      govtInfo,
      // Game state
      starState,
      planetState,
      explorers,
      // Combined views (computed)
      starInfo,
      planetInfo,
      // Getters
      galaxy,
      // Actions
      newRandomSeed,
      ensureSeeded,
      tick,
      beginTick,
      stopTick,
      starSystemPlanets,
    };
  },
  {
    persist: ENABLE_PERSISTENCE && {
      key: "galaxy-v2",
      pick: [
        "seed",
        "starData",
        "planetData",
        "govtInfo",
        "starState",
        "planetState",
        "explorers",
        "messages",
      ],
    },
  },
);
