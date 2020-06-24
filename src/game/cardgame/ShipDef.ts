export interface ShipDef {
  id: string;
  name: string;
  imageID: string;
  equipment: string[];
  hitPoints: number;
}

export const SHIP_DEFS_LIST: ShipDef[] = [
  {
    id: "normie",
    name: "Normie I",
    imageID: "Enemy3b.png",
    equipment: ["lasers-1", "shields-1"],
    hitPoints: 10,
  },

  {
    id: "mob-1",
    name: "Mob I",
    imageID: "Enemy3b.png",
    equipment: ["lasers-1", "shields-1"],
    hitPoints: 5,
  },
];

export const SHIP_DEFS = new Map<string, ShipDef>(
  SHIP_DEFS_LIST.map((d) => [d.id, d])
);
