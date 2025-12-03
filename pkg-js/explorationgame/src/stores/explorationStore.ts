import type { ExplorationLevel } from "@spacegame/galaxyrender";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useGalaxyStore } from "./galaxyStore";

export const useExplorationStore = defineStore("exploration", () => {
  const galaxyStore = useGalaxyStore();
  const starExploration = ref<Record<string, ExplorationLevel>>({});

  function setExploration(starID: string, level: ExplorationLevel) {
    starExploration.value[starID] = level;
  }

  function getExploration(starID: string): ExplorationLevel {
    return starExploration.value[starID] ?? "undiscovered";
  }

  function reset() {
    console.log("[explorationStore] reset");

    starExploration.value = {};

    // Initialize exploration: all stars discovered, home star system explored
    for (const id of Object.keys(galaxyStore.galaxy.stars)) {
      setExploration(id, "discovered");
    }
    setExploration(galaxyStore.galaxy.homeStarID, "systemExplored");
    for (const neighborID of galaxyStore.galaxy.getNeighborIDs(
      galaxyStore.galaxy.homeStarID,
    )) {
      setExploration(neighborID, "starExplored");
    }
  }

  reset();

  return { starExploration, setExploration, getExploration, reset };
});
