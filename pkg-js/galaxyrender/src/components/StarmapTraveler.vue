<template>
  <g
    class="Starmap_Traveler"
    :id="traveler.id"
    :transform="`translate(${position.x}, ${position.y})`"
    @click="emit('select')"
  >
    <slot :rotation="rotation" />
  </g>
</template>

<script setup lang="ts">
import type { Vector2 } from "@spacegame/galaxygen";
import { computed } from "vue";
import type { Traveler } from "../types";

const props = defineProps<{
  traveler: Traveler;
  position: Vector2;
  sourcePosition?: Vector2;
  destPosition?: Vector2;
}>();

const emit = defineEmits<{
  select: [];
}>();

const rotation = computed(() => {
  if (!props.sourcePosition || !props.destPosition) return 0;
  const dx = props.destPosition.x - props.sourcePosition.x;
  const dy = props.destPosition.y - props.sourcePosition.y;
  // Convert radians to degrees, add 90 to point the ship in the direction of travel
  // (assuming the ship image points upward by default)
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
});
</script>

<style scoped>
.Starmap_Traveler {
  cursor: pointer;
}
</style>
