import type { ExplorationLevel } from "@spacegame/galaxyrender";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useExplorationStore = defineStore("exploration", () => {
  const starExploration = ref<Record<string, ExplorationLevel>>({});

  function setExploration(starID: string, level: ExplorationLevel) {
    starExploration.value[starID] = level;
  }

  function getExploration(starID: string): ExplorationLevel {
    return starExploration.value[starID] ?? "undiscovered";
  }

  return { starExploration, setExploration, getExploration };
});
