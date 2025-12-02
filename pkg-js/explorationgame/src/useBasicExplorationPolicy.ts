import { watch } from "vue";
import { usePlayerStore } from "./stores/playerStore";
import { useExplorationStore } from "./stores/explorationStore";
import { useGalaxyStore } from "./stores/galaxyStore";

export default function useBasicExplorationPolicy() {
  const explorationStore = useExplorationStore();
  const { galaxy } = useGalaxyStore();
  const playerStore = usePlayerStore();

  watch(
    () => playerStore.starID,
    (newStarID) => {
      explorationStore.setExploration(newStarID, "systemExplored");
      for (const neighborID of galaxy.getNeighborIDs(newStarID)) {
        // Only upgrade to starExplored if not already systemExplored
        if (explorationStore.getExploration(neighborID) !== "systemExplored") {
          explorationStore.setExploration(neighborID, "starExplored");
        }
      }
    }
  );
}
