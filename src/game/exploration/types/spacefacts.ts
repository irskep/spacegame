import { GalaxyState } from "@/store/types";
import { Planet, StarSystem } from "stellardream";
import { Galaxy } from "./Galaxy";

type StarExplorationState = "None" | "Some" | "All";

export function getStarExplorationState(
  state: GalaxyState,
  galaxy: Galaxy,
  starID: string
) {
  const info = state.starInfo[starID];
  if (!info.known || !info.explored) return "None";

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    const neighborInfo = state.starInfo[neighborID];
    if (!neighborInfo.known) return "Some";
  }

  return "All";
}
