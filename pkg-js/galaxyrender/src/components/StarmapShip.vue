<template>
  <g class="StarmapShip" :transform="`rotate(${rotation})`">
    <image
      :href="imageURL"
      :x="-imageSize.x / 2"
      :y="-imageSize.y / 2"
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
  rotation: number;
}>();
</script>
