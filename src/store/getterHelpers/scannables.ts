import { Galaxy } from "@/game/exploration/types/Galaxy";
import { GalaxyState, Scannable } from "../types";

export function getScannables(
  g: Galaxy,
  state: GalaxyState,
  starID: string
): Scannable[] {
  const info = state.starInfo[starID];

  const results1: Scannable[] = info.planetIDs
    .map((id) => state.planetInfo[id])
    .filter((p) => !p.known)
    .map((p) => {
      return {
        scanTimeFactor: 1,
        text: `${info.name} ${p.index + 1}`,
        targetID: p.id,
        kind: "planet",
      };
    });

  const results2: Scannable[] = g
    .getNeighborIDs(starID)
    .map((id) => state.starInfo[id])
    .sort()
    .filter((info2) => !info2.known)
    .map((info2) => {
      return {
        scanTimeFactor: 1,
        text: info2.name,
        targetID: info2.id,
        kind: "star",
      };
    });

  return results1.concat(results2);
}
