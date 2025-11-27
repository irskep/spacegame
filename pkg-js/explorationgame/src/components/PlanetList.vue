<template>
  <div class="PlanetList">
    <h6>{{ starName }}</h6>
    <p
      v-for="(planet, i) in planets"
      :key="i"
      class="Planet"
      :class="planetClass(planet)"
    >
      {{ ordinals[i] }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Planet } from "stellardream";

const props = defineProps<{
  starName: string;
  planets: Planet[];
  habitableZoneMin: number;
  habitableZoneMax: number;
}>();

const ordinals = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
  "Eleventh",
  "Twelfth",
];

function planetClass(planet: Planet) {
  const inHZ =
    planet.distance >= props.habitableZoneMin &&
    planet.distance <= props.habitableZoneMax;
  return {
    Planet: true,
    [`m-${planet.planetType}`]: true,
    "m-habitable": inHZ && planet.planetType === "Terran",
  };
}
</script>

<style scoped>
.PlanetList h6 {
  margin: 0 0 0.5rem 0;
  color: white;
}

.Planet {
  margin: 0.25rem 0;
}

.Planet.m-Neptunian {
  color: teal;
}

.Planet.m-Terran {
  color: lightblue;
}

.Planet.m-Jovian {
  color: tan;
}

.Planet.m-habitable {
  color: lightgreen;
}
</style>
