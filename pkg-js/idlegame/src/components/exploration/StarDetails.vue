<template>
  <div class="StarDetails" v-if="star">
    <h6>{{ star.name }}</h6>
    <p v-for="planet in planetRollups" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PlanetInfo, StarMetadata } from "@spacegame/galaxygen";
import { computed } from "vue";

interface PlanetRollup {
  name: string;
  planetType: string;
  cssClass: Record<string, boolean>;
}

const props = defineProps<{
  star: StarMetadata;
  planets: PlanetInfo[];
}>();

const planetRollups = computed<PlanetRollup[]>(() => {
  if (!props.star.explored) return [];

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
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
    "Twentieth",
  ];

  return props.planets
    .filter((p: PlanetInfo) => p.known)
    .map((p: PlanetInfo) => ({
      name: ordinals[p.index],
      planetType: p.type,
      cssClass: {
        Planet: true,
        [`m-${p.type}`]: true,
        "m-habitable": p.isTerranHabitable,
      },
    }));
});
</script>

<style scoped>
.Planet.m-Neptunian {
  color: teal;
}
.Planet.m-Terran {
  color: lightblue;
}
.Planet.m-Jovian {
  color: tan;
}
.Planet.m-Terran.m-habitable {
  color: lightgreen;
}
</style>
