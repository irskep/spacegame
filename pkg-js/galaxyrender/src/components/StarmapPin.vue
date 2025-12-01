<template>
  <g class="StarmapPin">
    <line x1="0" y1="-10" x2="0" y2="0" stroke="white" />
    <circle cx="0" cy="-23" r="12" stroke="white" fill="black" />
    <image
      :href="imageURL"
      :x="-imageSize.x / 2"
      :y="-23 - imageSize.y / 2"
      :width="imageSize.x"
      :height="imageSize.y"
    />
  </g>
</template>

<script setup lang="ts">
import type { Vector2 } from "@spacegame/galaxygen";

defineProps<{
  imageURL: string;
  imageSize: Vector2;
}>();
</script>
