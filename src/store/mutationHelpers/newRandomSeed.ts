import { GovtSystem } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataSystem } from "@/game/exploration/gen/StarMetadataSystem";
import { GalaxyState, PlanetTemp } from "../types";
import { generateExplorer } from "@/game/exploration/gen/explorers";
import { getGalaxy } from "../getterHelpers/getGalaxy";
import { getStarSystem } from "../getterHelpers/starSystems";

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

  for (const star of Object.values(g.stars)) {
    const sys = getStarSystem(star.id);
    state.starInfo[star.id].planetIDs.forEach((planetID, i) => {
      const planet = sys.planets[i];
      let temp: PlanetTemp = "cold";
      if (planet.distance > sys.habitableZoneMax) {
        temp = "cold";
      } else if (planet.distance < sys.habitableZoneMin) {
        temp = "hot";
      } else {
        temp = "hab";
      }
      const isTidallyLocked = temp !== "cold" && sys.stars[0].starType == "M";
      const isTerranHabitable =
        temp === "hab" && !isTidallyLocked && planet.planetType === "Terran";
      state.planetInfo[planetID] = {
        id: planetID,
        index: i,
        name: null,
        known: false,
        temp,
        type: planet.planetType,
        isTidallyLocked,
        isTerranHabitable,
      };
      if (isTerranHabitable) {
        state.starInfo[star.id].hasTerranHabitable = true;
      }
    });
  }

  return state;
}
