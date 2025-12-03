import { defineStore } from "pinia";
import { ref } from "vue";
import { useEventStore } from "./eventStore";

export const useTechStore = defineStore(
  "tech",
  () => {
    const unlockedTechIDs = ref<string[]>([]);

    function isUnlocked(techID: string): boolean {
      return unlockedTechIDs.value.includes(techID);
    }

    function unlock(techID: string) {
      if (!isUnlocked(techID)) {
        unlockedTechIDs.value.push(techID);
        const eventStore = useEventStore();
        eventStore.emit("techUnlocked", techID);
      }
    }

    function lock(techID: string) {
      const index = unlockedTechIDs.value.indexOf(techID);
      if (index !== -1) {
        unlockedTechIDs.value.splice(index, 1);
      }
    }

    return { unlockedTechIDs, isUnlocked, unlock, lock };
  },
  {
    persist: {
      afterHydrate: (ctx) => {
        ctx.store.$persist();
      },
    },
  },
);
