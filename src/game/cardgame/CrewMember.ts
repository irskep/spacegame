export interface CrewMember {
  id: string;
  name: string;
  subtitle: string;
  portraitID: string;
  cards: string[];
}

export const CREW_MEMBER_LIST = [
  {
    id: "Alex",
    name: "Alex",
    subtitle: "Engineer",
    portraitID: "Mothership Chars 12.jpg",
    cards: ["shields-1", "shields-1", "shields-1"],
  },

  {
    id: "Taylor",
    name: "Taylor",
    subtitle: "Gunner",
    portraitID: "Mothership Chars 44.jpg",
    cards: ["pewpew", "pewpew", "pewpew"],
  },

  {
    id: "Skylar",
    name: "Skylar",
    subtitle: "Generalist",
    portraitID: "Mothership Chars 55.jpg",
    cards: ["pewpew", "pewpew", "shields-1", "shields-1"],
  },
];

export const CREW_MEMBERS = new Map<string, CrewMember>(
  CREW_MEMBER_LIST.map((d) => [d.id, d])
);
