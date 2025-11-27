import { RNG } from "@spacegame/galaxygen";

type PlanetType = "Terran" | "Neptunian" | "Jovian";

const hueRanges: Record<PlanetType, [number, number]> = {
  Terran: [60, 270],
  Neptunian: [180, 270],
  Jovian: [10, 60],
};

const saturationRanges: Record<PlanetType, [number, number]> = {
  Terran: [0.05, 0.7],
  Neptunian: [0.05, 0.65],
  Jovian: [0.1, 0.4],
};

const brightnessRanges: Record<PlanetType, [number, number]> = {
  Terran: [0.4, 0.9],
  Neptunian: [0.4, 0.9],
  Jovian: [0.4, 0.9],
};

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

function mix(n: number, a: number, b: number): number {
  return a * n + b * (1 - n);
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function planetGradient(seed: string, planetType: PlanetType): string {
  const rng = new RNG(seed);
  const variation = 0.5;

  const hueRange = hueRanges[planetType];
  const satRange = saturationRanges[planetType];
  const brightRange = brightnessRanges[planetType];

  const colorAHue = lerp(hueRange[0], hueRange[1], rng.getRandom());
  const colorASat = lerp(satRange[0], satRange[1], rng.getRandom());
  const colorABright = lerp(brightRange[0], brightRange[1], rng.getRandom());

  const colorBHue = mix(
    variation,
    lerp(hueRange[0], hueRange[1], rng.getRandom()),
    colorAHue,
  );
  const colorBSat = mix(
    variation,
    lerp(satRange[0], satRange[1], rng.getRandom()),
    colorASat,
  );
  const colorBBright = mix(
    variation,
    lerp(brightRange[0], brightRange[1], rng.getRandom()),
    colorABright,
  );

  return `
    radial-gradient(circle at top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%),
    radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,1) 100%),
    linear-gradient(to top,
      hsl(${colorAHue}, ${pct(colorASat)}, ${pct(colorABright)}) 0%,
      hsl(${colorBHue}, ${pct(colorBSat)}, ${pct(colorBBright)}) 100%)
  `
    .replace(/\n/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const planetSizes: Record<PlanetType, number> = {
  Terran: 5,
  Neptunian: 20,
  Jovian: 40,
};
