export interface CardDef {
  id: string;
  name: string;
  effects: string[];
}

export const CARD_DEF_LIST: CardDef[] = [
  {
    id: "pewpew",
    name: "Pew Pew",
    effects: ["fire-lasers"],
  },
  {
    id: "shields-1",
    name: "Basic Shields",
    effects: ["raise-shields-1"],
  },
];

export const CARD_DEFS = new Map<string, CardDef>(
  CARD_DEF_LIST.map((d) => [d.id, d])
);
