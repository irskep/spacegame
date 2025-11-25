// Types

// Constants and defs
export { MAX_STAR_SPACE, MIN_STAR_SPACE } from "./constants";
export { SPACESHIP_IMAGES } from "./defs/shipGfx";

// Framework utilities
export { RNG } from "./framework/RNG";
export { add, distance, lerp, multScalar, sub } from "./framework/util";
export {
  getDoLineSegmentsIntersect,
  scaleToHeight,
  type Vector2,
} from "./framework/Vector2";
export { generateExplorer } from "./gen/explorers";
export { default as govtnames } from "./gen/govtnames";
export { default as peoplenames } from "./gen/peoplenames";
export { GovtSystem } from "./gen/StarGovtSystem";
export { StarMetadataSystem } from "./gen/StarMetadataSystem";
export { default as shipnames } from "./gen/shipnames";
// Generation
export { generateStars } from "./gen/stargen";
// Name generators
export { default as starnames } from "./gen/starnames";
export { getScannables } from "./helpers/scannables";
// Helpers
export {
  generateStarSystem,
  getPlanetID,
  getStarSystem,
} from "./helpers/starSystems";
export * from "./types";
export { getStarExplorationState } from "./types/spacefacts";
