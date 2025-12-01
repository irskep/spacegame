<template>
  <g
    class="Starmap_Node"
    :id="node.id"
    @click="(e) => emit('select', e.shiftKey)"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
  >
    <!-- Pulse annotation -->
    <template v-if="pulseAnnotation">
      <circle
        class="Starmap_Node_Pulse"
        :cx="node.position.x"
        :cy="node.position.y"
        r="5"
        fill="none"
        :stroke="pulseAnnotation.color ?? '#4488ff'"
      />
      <circle
        class="Starmap_Node_Pulse Starmap_Node_Pulse--delayed"
        :cx="node.position.x"
        :cy="node.position.y"
        r="5"
        fill="none"
        :stroke="pulseAnnotation.color ?? '#4488ff'"
      />
    </template>

    <!-- Background annotation (outer ring) -->
    <circle
      v-if="backgroundAnnotation"
      class="Starmap_Node_Outer"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="10"
      :fill="backgroundAnnotation.color"
      fill-opacity="0.7"
    />

    <!-- Black circle -->
    <circle
      class="Starmap_Node_Inner"
      :cx="node.position.x"
      :cy="node.position.y"
      :r="5"
      fill="black"
      :stroke="
        visualState.exploration === 'discovered'
          ? 'var(--color-bg-button)'
          : 'none'
      "
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
import type { Node, NodeAnnotation, NodeVisualState } from "../types";

const props = defineProps<{
  node: Node;
  visualState: NodeVisualState;
}>();

const emit = defineEmits<{
  select: [shiftKey: boolean];
  hover: [nodeID: string | null];
}>();

const annotations = computed(() => props.visualState.annotations ?? []);

const backgroundAnnotation = computed(() =>
  annotations.value.find(
    (a): a is NodeAnnotation & { type: "background" } =>
      a.type === "background",
  ),
);

const pulseAnnotation = computed(() =>
  annotations.value.find(
    (a): a is NodeAnnotation & { type: "pulse" } => a.type === "pulse",
  ),
);

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

@keyframes pulse-expand {
  0% {
    r: 5;
    opacity: 0.8;
  }
  100% {
    r: 25;
    opacity: 0;
  }
}

.Starmap_Node_Pulse {
  animation: pulse-expand 2s ease-out infinite;
}

.Starmap_Node_Pulse--delayed {
  animation-delay: 1s;
}
</style>
