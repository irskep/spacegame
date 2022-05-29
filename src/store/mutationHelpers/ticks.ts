import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";
import { distance } from "@/game/framework/util";
import { addMessage } from "./messages";
import { Explorer, ExplorerState, GalaxyState } from "../types";
import { getScannables } from "../getterHelpers/scannables";

const CONSTANTS = {
  travelTime: 5,
  scanTime: 2,
};

function expandStar(state: GalaxyState, galaxy: Galaxy, starID: string) {
  state.starInfo[starID].known = true;
  state.starInfo[starID].explored = true;

  for (const neighborID of galaxy.getNeighborIDs(starID)) {
    state.starInfo[neighborID].known = true;
  }
}

export type ExplorerTickFunction = (
  dt: number,
  state: GalaxyState,
  galaxy: Galaxy,
  e: Explorer
) => void;
export const TICKS: Record<ExplorerState, ExplorerTickFunction> = {
  traveling: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ) {
    if (!e.destinationStarID) {
      const unexploredNeighbors = galaxy
        .getNeighbors(galaxy.stars[e.starID])
        .filter((star) => !state.starInfo[star.id].explored);
      if (unexploredNeighbors.length) {
        e.destinationStarID = new RNG(`${Math.random()}`).choice(
          unexploredNeighbors
        ).id;
      } else {
        e.destinationStarID = new RNG(`${Math.random()}`).choice(
          galaxy.getNeighborIDs(e.starID)
        );
      }
      e.travelProgress = 0;
    }

    const srcStar = galaxy.stars[e.starID];
    const destStar = galaxy.stars[e.destinationStarID];
    const starDist = distance(srcStar.point, destStar.point);

    const speedFactor = 50 / starDist;

    e.travelProgress += (dt * speedFactor) / CONSTANTS.travelTime;
  },
  scanning: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ) {
    if (!e.scannable) {
      const scannables = getScannables(galaxy, state, e.starID);
      if (!scannables.length) return;
      e.scannable = scannables[0];
    }

    e.scanProgress += dt / CONSTANTS.scanTime;
  },
};

export type ExplorerNextFunction = (
  dt: number,
  state: GalaxyState,
  galaxy: Galaxy,
  e: Explorer
) => ExplorerState | null;
export const NEXTS: Record<ExplorerState, ExplorerNextFunction> = {
  traveling: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ): ExplorerState | null {
    if (e.travelProgress < 1) return null;
    if (!e.destinationStarID) return "scanning"; // error state

    expandStar(state, galaxy, e.destinationStarID);
    e.travelProgress = 0;
    e.starID = e.destinationStarID;
    e.destinationStarID = null;

    for (const e2 of Object.values(state.explorers)) {
      if (e2.starID === e.starID && e.id !== e2.id) {
        // Immediately travel again, there's another ship here
        return "traveling";
      }
    }
    return "scanning";
  },
  scanning: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ): ExplorerState | null {
    if (!e.scannable) return "traveling"; // nothing to scan
    if (e.scanProgress < 1) return null;

    switch (e.scannable.kind) {
      case "planet":
        state.planetInfo[e.scannable.targetID].known = true;
        addMessage(state, `${e.name} discovered ${e.scannable.text}`);
        break;
      case "star":
        state.starInfo[e.scannable.targetID].known = true;
        addMessage(state, `${e.name} discovered ${e.scannable.text}`);
        break;
    }

    return "traveling";
  },
};

export const STARTS: Record<ExplorerState, ExplorerTickFunction> = {
  traveling: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ) {
    e.destinationStarID = null; // tick will pick a destination
    e.travelProgress = 0;
  },
  scanning: function (
    dt: number,
    state: GalaxyState,
    galaxy: Galaxy,
    e: Explorer
  ) {
    e.scanProgress = 0;
  },
};
