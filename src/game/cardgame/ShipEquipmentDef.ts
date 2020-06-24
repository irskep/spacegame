export interface ShipEquipmentDef {
  id: string;
  name: string;
  laserPoints?: number;
  shieldPoints?: number;
  satisfies: string[];
}

export const SHIP_EQUIPMENT_LIST: ShipEquipmentDef[] = [
  {
    id: "lasers-1",
    name: "Basic Laser",
    laserPoints: 1,
    satisfies: ["has.weapon.laser"],
  },
  {
    id: "shields-1",
    name: "Basic Shields",
    shieldPoints: 10,
    satisfies: ["has.shields"],
  },
];

export const SHIP_EQUIPMENT = new Map<string, ShipEquipmentDef>(
  SHIP_EQUIPMENT_LIST.map((d) => [d.id, d])
);
