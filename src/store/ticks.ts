import { Galaxy } from "@/game/exploration/types/Galaxy";
import { RNG } from "@/game/framework/RNG";
import { distance } from "@/game/framework/util";
import { Explorer } from "./types";

const CONSTANTS = {
  travelTime: 10000,
  scanTime: 10000,
};

export function tickTravel(dt: number, galaxy: Galaxy, e: Explorer) {
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
    e.travelProgress = 0;
    e.starID = e.destinationStarID;
    e.destinationStarID = null;
    e.state = "scanning";
  }
}

export function tickScan(dt: number, galaxy: Galaxy, e: Explorer) {
  e.scanProgress += dt / CONSTANTS.scanTime;

  if (e.scanProgress >= 1) {
    e.scanProgress = 0;
    e.state = "traveling";
  }
}
