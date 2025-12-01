import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useGalaxyStore } from "./galaxyStore";

export const usePlayerStore = defineStore(
  "player",
  () => {
    const galaxyStore = useGalaxyStore();

    const starID = ref(galaxyStore.galaxy.homeStarID);
    const destStarID = ref<string | null>(null);
    const progress = ref(0);

    // Validate starID exists in galaxy after hydration
    watch(
      starID,
      (id) => {
        if (!galaxyStore.galaxy.stars[id]) {
          starID.value = galaxyStore.galaxy.homeStarID;
        }
      },
      { immediate: true },
    );

    const isTraveling = computed(() => destStarID.value !== null);

    function startTravel(destID: string) {
      destStarID.value = destID;
      progress.value = 0;
    }

    function tick(dt: number, speed: number) {
      if (destStarID.value) {
        progress.value += dt * speed;
        if (progress.value >= 1) {
          starID.value = destStarID.value;
          destStarID.value = null;
          progress.value = 0;
        }
      }
    }

    return {
      starID,
      destStarID,
      progress,
      isTraveling,
      startTravel,
      tick,
    };
  },
  {
    persist: {
      afterHydrate: (ctx) => {
        ctx.store.$persist();
      },
    },
  },
);
