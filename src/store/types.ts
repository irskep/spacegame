import { CrewMember } from "@/game/cardgame/CrewMember";

export interface CardGameShip {
  shipID: string;
  hitPoints: number;
}

export interface CardGameCrewMember {
  crewID: string;

  drawPile: string[];
  discardPile: string[];
  hand: string[];

  // to be added later
  effects: string[];
}

export interface GalaxyState {
  seed: string;
  playerLocationStarID: string | null;
}

export interface CardGameState {
  ship: CardGameShip;
  crew: CardGameCrewMember[];
}

export interface RootState {
  galaxy: GalaxyState;
}
