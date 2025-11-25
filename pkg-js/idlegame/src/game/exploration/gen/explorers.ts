import { Explorer } from "@/store/types";
import shipnames from "@/game/exploration/gen/shipnames";
import peoplenames from "@/game/exploration/gen/peoplenames";
import { RNG } from "@/game/framework/RNG";
import { SPACESHIP_IMAGES } from "@/game/defs/shipGfx";

let nextId = 1;
const makeID = (prefix: string) => {
  return `${prefix}-${nextId++}`;
};

export function generateExplorer(
  starID: string,
  usedNames: string[]
): Explorer {
  let shipName = shipnames.flatten("#shipname#");
  while (usedNames.indexOf(shipName) >= 0) {
    shipName = shipnames.flatten("#shipname#");
  }
  return {
    id: makeID("explorer"),
    name: shipName,
    starID,
    destinationStarID: null,
    travelProgress: 0,
    scanProgress: 0,
    scannable: null,
    state: "traveling",
    ship: {
      id: makeID("ship"),
      kind: "Clipper",
      image: new RNG(`${Math.random()}`).choice(SPACESHIP_IMAGES),
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
