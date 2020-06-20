export interface CardDef {
  id: string;
  name: string;
  effects: string[];
}

export const CARDS: CardDef[] = [
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
