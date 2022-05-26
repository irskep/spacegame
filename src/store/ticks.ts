import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";
import { distance } from "@/game/framework/util";
import { Explorer, GalaxyState } from "./types";

const CONSTANTS = {
  travelTime: 10000,
  scanTime: 10000,
};

function expandStar(state: GalaxyState, galaxy: Galaxy, starID: string) {
  state.starInfo[starID].known = true;
  state.starInfo[starID].explored = true;

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    state.starInfo[neighborID].known = true;
  }
}

export function tickTravel(
  dt: number,
  state: GalaxyState,
  galaxy: Galaxy,
  e: Explorer
) {
  if (!e.destinationStarID) {
    e.destinationStarID = new RNG(`${Math.random()}`).choice(
      galaxy.getNeighborIDs(e.starID)
    );
    e.travelProgress = 0;
  }
  const srcStar = galaxy.stars[e.starID];
  const destStar = galaxy.stars[e.destinationStarID];
  const starDist = distance(srcStar.point, destStar.point);

  const speedFactor = 50 / starDist;

  e.travelProgress += (dt * speedFactor) / CONSTANTS.travelTime;
  if (e.travelProgress >= 1) {
    expandStar(state, galaxy, e.destinationStarID);
    e.travelProgress = 0;
    e.starID = e.destinationStarID;
    e.destinationStarID = null;

    for (const e2 of Object.values(state.explorers)) {
      if (e2.starID === e.starID && e.id !== e2.id) {
        // Immediately travel again, there's another ship here
        return;
      }
    }
    e.state = "scanning";
  }
}

export function tickScan(
  dt: number,
  state: GalaxyState,
  galaxy: Galaxy,
  e: Explorer
) {
  e.scanProgress += dt / CONSTANTS.scanTime;

  if (e.scanProgress >= 1) {
    e.scanProgress = 0;
    e.state = "traveling";
  }
}
