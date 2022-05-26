export interface GalaxyState {
  seed: string;
  playerLocationStarID: string | null;
}

export interface RootState {
  galaxy: GalaxyState;
}
