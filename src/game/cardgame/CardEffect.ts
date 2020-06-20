export interface CardEffect {
  id: string;
  name: string;
  requirements: string[];
  description: string;
}

export const CARD_EFFECTS: CardEffect[] = [
  {
    id: "fire-lasers",
    name: "Fire laser weapon",
    requirements: ["has.weapon.laser"],
    description: "Fires the ship’s laser weapon at the enemy",
  },
  {
    id: "raise-shields-1",
    name: "Raise shields by 1",
    requirements: ["has.shields"],
    description: "Raises the ship's shields by 1 point",
    // If shields at max, do nothing
  },
];
