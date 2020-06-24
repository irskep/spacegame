import { Module } from "vuex";
import { CardGameState, RootState } from "./types";
import { SHIP_DEFS } from "@/game/cardgame/ShipDef";
import { CREW_MEMBERS } from "@/game/cardgame/CrewMember";

export const CardGameModule: Module<CardGameState, RootState> = {
  namespaced: true,
  state: {
    ship: {
      shipID: "normie",
      hitPoints: 10,
    },
    crew: [
      {
        crewID: "",
        drawPile: [],
        discardPile: [],
        hand: [],
        effects: [],
      },
    ],
  },
  getters: {},
  actions: {},
  mutations: {
    enter(
      state: CardGameState,
      arg: { shipID: string; crewMembers: string[] }
    ) {
      state.ship = {
        shipID: arg.shipID,
        hitPoints: SHIP_DEFS.get(arg.shipID)!.hitPoints,
      };
      state.crew = arg.crewMembers.map((crewID) => {
        const c = CREW_MEMBERS.get(crewID)!;
        return {
          crewID,
          drawPile: c.cards.slice(3),
          discardPile: [],
          effects: [],
          hand: [c.cards[0], c.cards[1], c.cards[2]],
        };
      });
    },
  },
};
