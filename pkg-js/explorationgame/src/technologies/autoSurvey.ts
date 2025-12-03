import type { useEventStore } from "@/stores/eventStore";
import { useExplorationStore } from "@/stores/explorationStore";
import { useGalaxyStore } from "@/stores/galaxyStore";
import { usePlayerStore } from "@/stores/playerStore";
import type { useTechStore } from "@/stores/techStore";
import type { Technology } from "./Technology";

export const autoSurvey: Technology = {
  id: "autoSurvey",
  name: "Auto-Survey",
  description:
    "Automatically surveys adjacent star systems when you arrive at a new system.",
};

function surveyNeighbors(starID: string) {
  const explorationStore = useExplorationStore();
  const { galaxy } = useGalaxyStore();

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    if (explorationStore.getExploration(neighborID) !== "systemExplored") {
      explorationStore.setExploration(neighborID, "starExplored");
    }
  }
}

export function registerAutoSurveyEffects(
  eventStore: ReturnType<typeof useEventStore>,
  techStore: ReturnType<typeof useTechStore>,
) {
  eventStore.on("playerArrivedAtStar", (starID: string) => {
    if (!techStore.isUnlocked("autoSurvey")) return;
    surveyNeighbors(starID);
  });

  eventStore.on("techUnlocked", (techID: string) => {
    if (techID !== "autoSurvey") return;
    const playerStore = usePlayerStore();
    surveyNeighbors(playerStore.starID);
  });
}
