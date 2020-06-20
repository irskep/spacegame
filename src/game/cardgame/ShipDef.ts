export interface ShipDef {
  id: string;
  name: string;
  imageID: string;
  equipment: string[];
}

export const SHIP_DEFS: ShipDef[] = [
  {
    id: "normie",
    name: "Normie I",
    imageID: "Enemy3b.png",
    equipment: ["lasers-1", "shields-1"],
  },

  {
    id: "mob-1",
    name: "Mob I",
    imageID: "Enemy3b.png",
    equipment: ["lasers-1", "shields-1"],
  },
];
