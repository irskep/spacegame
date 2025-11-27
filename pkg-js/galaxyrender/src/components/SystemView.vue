<template>
  <div class="SystemView" ref="containerRef">
    <div class="SystemContent" :style="contentStyle">
      <!-- Orbital circles -->
      <div
        v-for="(planet, i) in planets"
        :key="'orbit-' + i"
        class="Orbit"
        :style="orbitStyle(planet)"
      />

      <!-- Star at center -->
      <div class="Star" :style="starStyle" />

      <!-- Planets -->
      <div
        v-for="(planet, i) in planets"
        :key="'planet-' + i"
        class="Planet"
        :style="planetStyle(planet, i)"
        :title="planet.planetType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RNG } from "@spacegame/galaxygen";
import type { Planet, Star } from "stellardream";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { planetGradient, planetSizes } from "../lib/planetGradient";

const props = defineProps<{
  star: Star;
  planets: Planet[];
  habitableZoneMin: number;
  habitableZoneMax: number;
  seed: string;
}>();

const SCALE = 50; // pixels per AU
const MIN_STAR_SIZE = 0.08;
const MIN_STAR_PX = 3;
const PADDING = 60; // pixels from edge

const containerRef = ref<HTMLElement | null>(null);
const viewportSize = ref({ width: 800, height: 600 });

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      viewportSize.value = { width, height };
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const maxOrbitRadius = computed(() => {
  if (props.planets.length === 0) return SCALE;
  return Math.max(...props.planets.map((p) => p.distance)) * SCALE;
});

const contentStyle = computed(() => {
  const needed = maxOrbitRadius.value * 2;
  const available =
    Math.min(viewportSize.value.width, viewportSize.value.height) - PADDING * 2;
  const cssScale = available / needed;
  return { transform: `scale(${cssScale})` };
});

const starStyle = computed(() => {
  const size = (MIN_STAR_PX / MIN_STAR_SIZE) * props.star.radius;
  const sizePx = `${size}px`;
  return {
    width: sizePx,
    height: sizePx,
    borderRadius: "50%",
    background: `
      radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%),
      radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,1) 100%),
      ${props.star.color}
    `,
    boxShadow: `0 0 20px 0 ${props.star.color}`,
  };
});

function isInHabitableZone(planet: Planet): boolean {
  return (
    planet.distance >= props.habitableZoneMin &&
    planet.distance <= props.habitableZoneMax
  );
}

function orbitStyle(planet: Planet) {
  const distancePx = planet.distance * SCALE;
  const diameter = distancePx * 2;
  const inHZ = isInHabitableZone(planet);
  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    borderRadius: "50%",
    border: `1px solid ${inHZ ? "#88ff88" : "#444"}`,
    position: "absolute" as const,
    top: "0",
    left: "0",
    transform: `translate(-50%, -50%)`,
  };
}

function planetStyle(planet: Planet, index: number) {
  const rng = new RNG(`${props.seed}-planet-${index}`);
  const angle = rng.getRandom() * Math.PI * 2;
  const distancePx = planet.distance * SCALE;

  const x = Math.cos(angle) * distancePx;
  const y = Math.sin(angle) * distancePx;

  const size = planetSizes[planet.planetType];
  const sizePx = `${size}px`;

  return {
    width: sizePx,
    height: sizePx,
    borderRadius: "50%",
    background: planetGradient(
      `${props.seed}-planet-${index}`,
      planet.planetType,
    ),
    position: "absolute" as const,
    top: "0",
    left: "0",
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
  };
}
</script>

<style scoped>
.SystemView {
  width: 100%;
  height: 100%;
  position: relative;
  background: black;
  overflow: hidden;
}

.SystemContent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
}

.Star {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.Planet {
  cursor: pointer;
}

.Planet:hover {
  filter: brightness(1.3);
}
</style>
