<template>
  <g
    class="Starmap_Node"
    :id="node.id"
    @click="emit('select')"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
  >
    <!-- Only show outer ring for special states (adjacent/current) -->
    <circle
      v-if="visualState.borderColor && visualState.borderColor !== '#616161'"
      class="Starmap_Node_Outer"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="10"
      :fill="visualState.borderColor"
      fill-opacity="0.7"
    />

    <!-- Black circle -->
    <circle
      class="Starmap_Node_Inner"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="5"
      fill="black"
      :stroke="visualState.exploration === 'discovered' ? 'white' : 'none'"
    />

    <!-- Colored star inside (for starExplored or systemExplored) -->
    <circle
      v-if="showStar"
      class="Starmap_Node_Star"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="3"
      :fill="node.star?.color ?? 'white'"
    />

    <!-- Ring around star (for systemExplored) -->
    <circle
      v-if="visualState.exploration === 'systemExplored'"
      class="Starmap_Node_SystemRing"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="4"
      fill="none"
      :stroke="node.star?.color ?? 'white'"
      stroke-width="0.5"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Node, NodeVisualState } from "../types";

const props = defineProps<{
  node: Node;
  visualState: NodeVisualState;
}>();

const emit = defineEmits<{
  select: [];
  hover: [nodeID: string | null];
}>();

const showStar = computed(() => {
  const level = props.visualState.exploration;
  return (
    (level === "starExplored" || level === "systemExplored") && props.node.star
  );
});
</script>

<style scoped>
.Starmap_Node {
  cursor: pointer;
}

.Starmap_Node:hover circle.Starmap_Node_Inner {
  stroke: yellow;
  fill: #333;
}
</style>
