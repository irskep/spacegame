import { Explorer } from "@/store/types";
import shipnames from "@/game/exploration/gen/shipnames";
import peoplenames from "@/game/exploration/gen/peoplenames";

let nextId = 1;
const makeID = (prefix: string) => {
  return `${prefix}-${nextId++}`;
};

export function generateExplorer(starID: string): Explorer {
  return {
    id: makeID("explorer"),
    name: shipnames.flatten("#shipname#"),
    starID,
    destinationStarID: null,
    travelProgress: 0,
    ship: {
      id: makeID("ship"),
      kind: "Clipper",
    },
    crew: [
      {
        id: makeID("crew"),
        name: peoplenames.flatten("#peoplename#"),
        role: "Captain",
      },
      {
        id: makeID("crew"),
        name: peoplenames.flatten("#peoplename#"),
        role: "Pilot",
      },
    ],
  };
}
