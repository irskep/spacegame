<template>
  <svg class="SystemViewSVG" :viewBox="viewBox" preserveAspectRatio="xMidYMid meet">
    <!-- Orbits -->
    <ellipse
      v-for="(planet, i) in planets"
      :key="'orbit-' + i"
      cx="0"
      cy="0"
      :rx="orbitRadius(i)"
      :ry="orbitRadius(i) * PERSPECTIVE"
      fill="none"
      :stroke="orbitColor(planet)"
      stroke-width="1"
    />

    <!-- Star -->
    <circle cx="0" cy="0" :r="starRadius" :fill="star.color" />

    <!-- Planets -->
    <circle
      v-for="(planet, i) in planets"
      :key="'planet-' + i"
      :cx="planetX(planet, i)"
      :cy="planetY(planet, i)"
      :r="planetSize(planet)"
      :fill="planetColor(planet, i)"
    />
  </svg>
</template>

<script setup lang="ts">
import { RNG } from "@spacegame/galaxygen";
import type { Planet, Star } from "stellardream";
import { computed } from "vue";
import { planetSizes } from "../lib/planetGradient";

const props = defineProps<{
  star: Star;
  planets: Planet[];
  habitableZoneMin: number;
  habitableZoneMax: number;
  seed: string;
}>();

// Planet sizes: Terran=5, Neptunian=20, Jovian=40
const MAX_PLANET_RADIUS = 40;
const MIN_STAR_PLANET_GAP = 160;
// First orbit is at starRadius + STAR_MARGIN from center
// Planet edge closest to star is at (starRadius + STAR_MARGIN - MAX_PLANET_RADIUS)
// Gap between star edge and planet edge = STAR_MARGIN - MAX_PLANET_RADIUS = MIN_STAR_PLANET_GAP
const STAR_MARGIN = MAX_PLANET_RADIUS + MIN_STAR_PLANET_GAP;
const ORBIT_SPACING = 360;
const VIEW_MARGIN = 30;
const MIN_STAR_RADIUS = 8;
const PERSPECTIVE = 0.35;

const starRadius = computed(() => {
  return Math.max(MIN_STAR_RADIUS, props.star.radius * 25);
});

function orbitRadius(planetIndex: number): number {
  return starRadius.value + STAR_MARGIN + planetIndex * ORBIT_SPACING;
}

const viewBox = computed(() => {
  const maxRadius =
    props.planets.length > 0 ? orbitRadius(props.planets.length - 1) : 50;
  const width = (maxRadius + VIEW_MARGIN) * 2;
  const height = (maxRadius * PERSPECTIVE + VIEW_MARGIN) * 2;
  return `${-width / 2} ${-height / 2} ${width} ${height}`;
});

function isInHabitableZone(planet: Planet): boolean {
  return (
    planet.distance >= props.habitableZoneMin &&
    planet.distance <= props.habitableZoneMax
  );
}

function orbitColor(planet: Planet): string {
  return isInHabitableZone(planet) ? "#88ff88" : "#444";
}

function planetSize(planet: Planet): number {
  return planetSizes[planet.planetType];
}

function planetAngle(_planet: Planet, index: number): number {
  const rng = new RNG(`${props.seed}-planet-${index}`);
  return rng.getRandom() * Math.PI * 2;
}

function planetX(_planet: Planet, index: number): number {
  const radius = orbitRadius(index);
  const angle = planetAngle(_planet, index);
  return Math.cos(angle) * radius;
}

function planetY(_planet: Planet, index: number): number {
  const radius = orbitRadius(index);
  const angle = planetAngle(_planet, index);
  return Math.sin(angle) * radius * PERSPECTIVE;
}

function planetColor(planet: Planet, index: number): string {
  const rng = new RNG(`${props.seed}-planet-${index}`);
  const hueRanges: Record<string, [number, number]> = {
    Terran: [60, 270],
    Neptunian: [180, 270],
    Jovian: [10, 60],
  };
  const hueRange = hueRanges[planet.planetType] || [0, 360];
  const hue = hueRange[0] + rng.getRandom() * (hueRange[1] - hueRange[0]);
  return `hsl(${hue}, 50%, 60%)`;
}
</script>

<style scoped>
.SystemViewSVG {
  width: 100%;
  height: 100%;
  background: black;
}
</style>
