<template>
  <g
    class="Starmap_Traveler"
    :id="traveler.id"
    :transform="`translate(${position.x}, ${position.y})`"
    @click="emit('select')"
  >
    <line :x1="0" :y1="-10" :x2="0" :y2="0" class="Edge" stroke="white" />

    <circle
      :class="{ pulse: selected }"
      :cx="0"
      :cy="-23"
      :r="12"
      stroke="white"
      fill="black"
    />

    <circle :cx="0" :cy="-23" :r="12" stroke="white" fill="black" />

    <image
      :href="traveler.imageURL"
      :x="-imageSize.x / 2"
      :y="-23 - imageSize.y / 2"
      transform-origin="center"
      :width="imageSize.x"
      :height="imageSize.y"
    />
  </g>
</template>

<script setup lang="ts">
import type { Vector2 } from "@spacegame/galaxygen";
import type { Traveler } from "../types";

defineProps<{
  traveler: Traveler;
  position: Vector2;
  imageSize: Vector2;
  selected: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();
</script>

<style scoped>
.Starmap_Traveler {
  cursor: pointer;
}

.pulse {
  animation-duration: 2s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    r: 9px;
  }
  50% {
    r: 15px;
  }
  100% {
    r: 9px;
  }
}
</style>
