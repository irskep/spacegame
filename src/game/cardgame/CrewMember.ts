export interface CrewMember {
  name: string;
  subtitle: string;
  portraitID: string;
  cards: string[];
}

export const CREW_MEMBERS = [
  {
    name: "Alex",
    subtitle: "Engineer",
    portraitID: "Mothership Chars 12.jpg",
    cards: ["shields-1", "shields-1", "shields-1"],
  },

  {
    name: "Taylor",
    subtitle: "Gunner",
    portraitID: "Mothership Chars 44.jpg",
    cards: ["pewpew", "pewpew", "pewpew"],
  },

  {
    name: "Skylar",
    subtitle: "Generalist",
    portraitID: "Mothership Chars 55.jpg",
    cards: ["pewpew", "pewpew", "shields-1", "shields-1"],
  },
];
