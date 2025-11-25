import type { Galaxy } from "@spacegame/galaxygen";
import type { GalaxyState } from "@/types";

type StarExplorationState = "None" | "Some" | "All";

export function getStarExplorationState(
  state: GalaxyState,
  galaxy: Galaxy,
  starID: string,
): StarExplorationState {
  const info = state.starInfo[starID];
  if (!info.known || !info.explored) return "None";

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    const neighborInfo = state.starInfo[neighborID];
    if (!neighborInfo.known) return "Some";
  }

  return "All";
}
