import { GalaxyState } from "../types";

export function addMessage(state: GalaxyState, msg: string): GalaxyState {
  state.messages.unshift(msg);
  while (state.messages.length > 100) {
    state.messages.pop();
  }
  return state;
}
