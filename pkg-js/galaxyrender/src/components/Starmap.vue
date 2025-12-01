<template>
  <svg class="Starmap" :viewBox="`0 0 ${size.x} ${size.y}`" preserveAspectRatio="xMinYMin meet">
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
    <StarmapNode
      v-for="node in visibleNodes"
      :key="node.id"
      :node="node"
      :visualState="getNodeVisualState(node.id)"
      @select="emit('selectNode', node.id)"
      @hover="(id) => emit('hoverNode', id)"
    />

    <!-- Travelers -->
    <StarmapTraveler
      v-for="traveler of travelers"
      :key="traveler.id"
      :traveler="traveler"
      :position="getTravelerPoint(traveler)"
      :imageSize="getImageSize(traveler.imageURL)"
      :selected="selectedTravelerID === traveler.id"
      @select="emit('selectTraveler', traveler.id)"
    />

    <!-- Hovered node label -->
    <text
      class="Starmap_Node_Label"
      v-if="hoveredNode && hoveredNodeID && isVisible(hoveredNodeID)"
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
import StarmapNode from "./StarmapNode.vue";
import StarmapTraveler from "./StarmapTraveler.vue";

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

function isVisible(nodeID: string): boolean {
  const state = props.nodeVisualStates[nodeID];
  return !!state?.exploration && state.exploration !== "undiscovered";
}

// Filter to only show nodes that are discovered or better
const visibleNodes = computed<Node[]>(() => {
  return props.nodes.filter((n) => isVisible(n.id));
});

// Filter to only show edges where both nodes are visible
const visibleEdges = computed<Edge[]>(() => {
  return props.edges.filter(
    (e) => isVisible(e.fromNodeID) && isVisible(e.toNodeID),
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
  width: 100%;
  height: 100%;
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
</style>
