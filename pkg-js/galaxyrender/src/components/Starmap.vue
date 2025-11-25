<template>
  <svg class="Starmap" :width="size.x" :height="size.y">
    <!-- Edges -->
    <line
      v-for="edge in visibleEdges"
      :key="`${edge.fromNodeID}-${edge.toNodeID}`"
      :x1="nodeMap[edge.fromNodeID]?.position.x"
      :y1="nodeMap[edge.fromNodeID]?.position.y"
      :x2="nodeMap[edge.toNodeID]?.position.x"
      :y2="nodeMap[edge.toNodeID]?.position.y"
      class="Edge"
      stroke="gray"
    />

    <!-- Nodes -->
    <g
      class="Starmap_Node"
      v-for="node in visibleNodes"
      :key="node.id"
      :id="node.id"
      @click="emit('selectNode', node.id)"
      @mouseenter="emit('hoverNode', node.id)"
      @mouseleave="emit('hoverNode', null)"
    >
      <circle
        class="Starmap_Node_Outer"
        :class="{ 'm-unexplored': !getNodeVisualState(node.id).known }"
        :cx="node.position.x"
        :cy="node.position.y"
        :r="10"
        :fill="getNodeVisualState(node.id).borderColor || '#616161'"
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

    <!-- Travelers -->
    <g
      v-for="traveler of travelers"
      :key="traveler.id"
      @click="emit('selectTraveler', traveler.id)"
      class="Starmap_Traveler"
      :transform="`translate(${getTravelerPoint(traveler).x}, ${getTravelerPoint(traveler).y})`"
      :id="traveler.id"
    >
      <line :x1="0" :y1="-10" :x2="0" :y2="0" class="Edge" stroke="white" />

      <circle
        :class="{ pulse: selectedTravelerID === traveler.id }"
        :cx="0"
        :cy="-23"
        :r="12"
        stroke="white"
        fill="black"
      />

      <circle :cx="0" :cy="-23" :r="12" stroke="white" fill="black" />

      <image
        :href="traveler.imageURL"
        :x="-getImageSize(traveler.imageURL).x / 2"
        :y="-23 - getImageSize(traveler.imageURL).y / 2"
        transform-origin="center"
        :width="getImageSize(traveler.imageURL).x"
        :height="getImageSize(traveler.imageURL).y"
      />
    </g>

    <!-- Hovered node label -->
    <text
      class="Starmap_Node_Label"
      v-if="hoveredNode && hoveredNodeID && getNodeVisualState(hoveredNodeID).known"
      :x="Math.max(2, hoveredNode.position.x - 40)"
      :y="Math.max(2, hoveredNode.position.y - 20)"
    >
      {{ hoveredNode.label }}
    </text>

    <!-- Selected traveler label -->
    <text
      class="Starmap_Traveler_Label"
      v-if="selectedTravelerID && travelerMap[selectedTravelerID]"
      :x="Math.max(2, getTravelerPoint(travelerMap[selectedTravelerID]).x - 40)"
      :y="Math.max(2, getTravelerPoint(travelerMap[selectedTravelerID]).y - 30)"
    >
      {{ travelerMap[selectedTravelerID].label }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { lerp, scaleToHeight, type Vector2 } from "@spacegame/galaxygen";
import { computed, ref } from "vue";
import type { Edge, Node, NodeVisualState, Traveler } from "../types";

const props = defineProps<{
  nodes: Node[];
  edges: Edge[];
  nodeVisualStates: Record<string, NodeVisualState>;
  travelers: Traveler[];
  selectedNodeID: string | null;
  selectedTravelerID: string | null;
  hoveredNodeID: string | null;
  imageSizes: Record<string, Vector2>;
  size: Vector2;
}>();

const emit = defineEmits<{
  selectNode: [nodeID: string];
  hoverNode: [nodeID: string | null];
  selectTraveler: [travelerID: string];
  addImageSize: [url: string, size: Vector2];
}>();

const seenImages = ref(new Set<string>());

// Create lookup maps for efficiency
const nodeMap = computed<Record<string, Node>>(() => {
  const map: Record<string, Node> = {};
  for (const node of props.nodes) {
    map[node.id] = node;
  }
  return map;
});

const travelerMap = computed<Record<string, Traveler>>(() => {
  const map: Record<string, Traveler> = {};
  for (const traveler of props.travelers) {
    map[traveler.id] = traveler;
  }
  return map;
});

// Filter to only show nodes that are known
const visibleNodes = computed<Node[]>(() => {
  return props.nodes.filter((n) => props.nodeVisualStates[n.id]?.known);
});

// Filter to only show edges where both nodes are known
const visibleEdges = computed<Edge[]>(() => {
  return props.edges.filter(
    (e) =>
      props.nodeVisualStates[e.fromNodeID]?.known &&
      props.nodeVisualStates[e.toNodeID]?.known,
  );
});

const hoveredNode = computed<Node | null>(() => {
  if (!props.hoveredNodeID) return null;
  return nodeMap.value[props.hoveredNodeID] || null;
});

function getNodeVisualState(nodeID: string): NodeVisualState {
  return props.nodeVisualStates[nodeID] || {};
}

function getImageSize(url: string): { x: number; y: number } {
  if (props.imageSizes[url]) {
    return scaleToHeight(props.imageSizes[url], 16);
  } else if (seenImages.value.has(url)) {
    return { x: 16, y: 16 };
  } else {
    seenImages.value.add(url);
    const img = new Image();
    img.onload = () => {
      const size = { x: img.width, y: img.height };
      emit("addImageSize", url, size);
    };
    img.src = url;
    return { x: 16, y: 16 };
  }
}

function getTravelerPoint(traveler: Traveler): Vector2 {
  const node = nodeMap.value[traveler.nodeID];
  if (!node) return { x: 0, y: 0 };
  if (traveler.destNodeID) {
    const destNode = nodeMap.value[traveler.destNodeID];
    if (!destNode) return node.position;
    return lerp(node.position, destNode.position, traveler.progress);
  } else {
    return node.position;
  }
}
</script>

<style scoped>
.Starmap {
  position: relative;
  background-color: black;
}

.Starmap .Edge.m-active {
  stroke: white;
  stroke-width: 2px;
}

.Starmap_Node_Label {
  fill: white;
  font-weight: bold;
}

.Starmap_Traveler_Label {
  fill: white;
}

.Starmap_Node:hover text {
  visibility: visible;
}

.Starmap_Node:hover circle.Starmap_Node_Inner {
  stroke: yellow;
  fill: #333;
}

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
