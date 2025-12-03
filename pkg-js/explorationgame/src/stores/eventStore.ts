import { defineStore } from "pinia";

export type GameEvent = "playerArrivedAtStar" | "techUnlocked";

type EventCallback<T extends GameEvent> = T extends "playerArrivedAtStar"
  ? (starID: string) => void
  : T extends "techUnlocked"
    ? (techID: string) => void
    : never;

export const useEventStore = defineStore("event", () => {
  const callbacks: Record<string, Array<(...args: unknown[]) => void>> = {};

  function on<T extends GameEvent>(event: T, callback: EventCallback<T>) {
    if (!callbacks[event]) {
      callbacks[event] = [];
    }
    callbacks[event].push(callback as (...args: unknown[]) => void);
  }

  function emit<T extends GameEvent>(
    event: T,
    ...args: Parameters<EventCallback<T>>
  ) {
    const eventCallbacks = callbacks[event];
    if (eventCallbacks) {
      for (const cb of eventCallbacks) {
        cb(...args);
      }
    }
  }

  return { on, emit };
});
