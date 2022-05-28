import { GovtSystem } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataSystem } from "@/game/exploration/gen/StarMetadataSystem";
import { GalaxyState } from "../types";
import { generateExplorer } from "@/game/exploration/gen/explorers";
import { getGalaxy } from "../getterHelpers/getGalaxy";

export function newRandomSeed(state: GalaxyState): GalaxyState {
  state.seed = `${Math.random()}`;
  const g = getGalaxy(state.seed);
  state.starInfo = StarMetadataSystem.makeMetadata(state.seed, g);
  state.govtInfo = GovtSystem.makeGovts(state.seed, getGalaxy(state.seed));
  state.explorers = {};
  for (let i = 0; i < 5; i++) {
    const e = generateExplorer(
      g.homeStarID,
      Object.values(state.explorers).map((e) => e.name)
    );
    state.explorers[e.id] = e;
  }

  state.starInfo[g.homeStarID].known = true;
  state.starInfo[g.homeStarID].explored = true;
  for (const neighborID of g.getNeighborIDs(g.homeStarID)) {
    state.starInfo[neighborID].known = true;
  }

  return state;
}
