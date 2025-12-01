import {
  type Galaxy,
  generateHomeStarSystem,
  generateStars,
  type StarDataMap,
  StarDataSystem,
} from "@spacegame/galaxygen";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

function generateSeed(): string {
  return `galaxy-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useGalaxyStore = defineStore(
  "galaxy",
  () => {
    console.log("galaxyStore: setup starting");
    const seed = ref(generateSeed());
    console.log("galaxyStore: initial seed =", seed.value);

    // Lazily generate galaxy when first accessed (after hydration completes)
    const galaxy = computed<Galaxy>(() => {
      console.log("galaxyStore: generating galaxy from seed =", seed.value);
      const g = generateStars(seed.value);
      generateHomeStarSystem(g.homeStarID);
      return g;
    });

    const starData = computed<StarDataMap>(() =>
      StarDataSystem.makeData(seed.value, galaxy.value),
    );

    function reset() {
      localStorage.removeItem("galaxy");
      localStorage.removeItem("player");
      window.location.reload();
    }

    console.log("galaxyStore: setup complete");
    return {
      seed,
      galaxy,
      starData,
      reset,
    };
  },
  {
    persist: {
      pick: ["seed"],
      afterHydrate: (ctx) => {
        // Ensure initial state is persisted (plugin only auto-persists on changes)
        ctx.store.$persist();
      },
    },
  },
);
