// Constants
export { MAX_STAR_SPACE, MIN_STAR_SPACE } from "./constants";

// Framework utilities
export { RNG } from "./framework/RNG";
export { add, distance, lerp, multScalar, sub } from "./framework/util";
export {
  getDoLineSegmentsIntersect,
  scaleToHeight,
  type Vector2,
} from "./framework/Vector2";
// Name generators
export { default as govtnames } from "./gen/govtnames";
export { default as peoplenames } from "./gen/peoplenames";
export { StarDataSystem } from "./gen/StarDataSystem";
export { GovtSystem } from "./gen/StarGovtSystem";
export { default as shipnames } from "./gen/shipnames";
// Generation
export { generateStars } from "./gen/stargen";
export { default as starnames } from "./gen/starnames";

// Helpers
export {
  generateHomeStarSystem,
  generateStarSystem,
  getPlanetID,
  getStarSystem,
} from "./helpers/starSystems";

// Types
export * from "./types";
