<template>
  <g
    class="Starmap_Node"
    :id="node.id"
    @click="emit('select')"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
  >
    <circle
      class="Starmap_Node_Outer"
      :class="{ 'm-unexplored': !visualState.known }"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="10"
      :fill="visualState.borderColor || '#616161'"
      fill-opacity="0.7"
    />

    <circle
      class="Starmap_Node_Inner"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="5"
      fill="black"
      stroke="white"
    />
  </g>
</template>

<script setup lang="ts">
import type { Node, NodeVisualState } from "../types";

defineProps<{
  node: Node;
  visualState: NodeVisualState;
}>();

const emit = defineEmits<{
  select: [];
  hover: [nodeID: string | null];
}>();
</script>

<style scoped>
.Starmap_Node:hover circle.Starmap_Node_Inner {
  stroke: yellow;
  fill: #333;
}
</style>
