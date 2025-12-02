<template>
  <PanContainer
    v-if="uiStateStore.activeView === 'galaxy'"
    class="MapContainer"
    :center="playerCenter"
    :contentSize="galaxy.size"
  >
    <Starmap
      :nodes="nodes"
      :edges="edges"
      :nodeVisualStates="nodeVisualStates"
      :travelers="travelers"
      :selectedNodeID="null"
      :selectedTravelerID="null"
      :hoveredNodeID="transientStore.hoveredNodeID"
      :imageSizes="imageSizes"
      :size="galaxy.size"
      @selectNode="onSelectNode"
      @hoverNode="(id) => (transientStore.hoveredNodeID = id)"
      @selectTraveler="() => {}"
      @addImageSize="onAddImageSize"
    />
  </PanContainer>
</template>

<script setup lang="ts">
import {
  Node,
  Edge,
  NodeAnnotation,
  NodeVisualState,
  PanContainer,
  Starmap,
  Traveler,
} from "@spacegame/galaxyrender";
import { useExplorationStore } from "@/stores/explorationStore";
import { useGalaxyStore } from "@/stores/galaxyStore";
import { useModalStore } from "@/stores/modalStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useTransientStore } from "@/stores/transientStore";
import { useUIStateStore } from "@/stores/uiStateStore";
import { computed, ref } from "vue";
import { getStarSystem, lerp, Vector2 } from "@spacegame/galaxygen";

const galaxyStore = useGalaxyStore();
const playerStore = usePlayerStore();
const transientStore = useTransientStore();
const modalStore = useModalStore();
const explorationStore = useExplorationStore();
const uiStateStore = useUIStateStore();

const { galaxy, starData } = galaxyStore;

// UI state
const imageSizes = ref<Record<string, Vector2>>({});

// Computed: adjacent star IDs
const adjacentStarIDs = computed<Set<string>>(() => {
  return new Set(galaxy.getNeighborIDs(playerStore.starID));
});

// Computed: player's current visual position
const playerPosition = computed<Vector2>(() => {
  const currentStar = galaxy.stars[playerStore.starID];
  if (!currentStar) return { x: 0, y: 0 };

  if (playerStore.destStarID) {
    const destStar = galaxy.stars[playerStore.destStarID];
    if (destStar) {
      return lerp(currentStar.point, destStar.point, playerStore.progress);
    }
  }

  return currentStar.point;
});

// Computed: center for PanContainer
const playerCenter = computed<Vector2>(() => playerPosition.value);

// Handle node selection - navigate on click, open modal on shift+click
function onSelectNode(nodeID: string, shiftKey: boolean) {
  if (shiftKey) {
    // Shift+click: open system view modal
    const starName = starData[nodeID]?.name ?? "Unknown";
    modalStore.push({ type: "systemView", starID: nodeID, starName });
  } else {
    // Click: navigate if adjacent and not already traveling
    if (adjacentStarIDs.value.has(nodeID) && !playerStore.isTraveling) {
      playerStore.startTravel(nodeID);
    }
  }
}

function onAddImageSize(url: string, size: Vector2) {
  imageSizes.value[url] = size;
}

// Map stars to nodes
const nodes = computed<Node[]>(() => {
  return Object.values(galaxy.stars).map((star) => ({
    id: star.id,
    position: star.point,
    label: starData[star.id]?.name,
    star: getStarSystem(star.id).stars[0],
  }));
});

// Map star connections to edges
const edges = computed<Edge[]>(() => {
  return galaxy.getAllNeighbors().map(([a, b]) => ({
    fromNodeID: a.id,
    toNodeID: b.id,
  }));
});

// Map to node visual states with annotations
const nodeVisualStates = computed<Record<string, NodeVisualState>>(() => {
  const states: Record<string, NodeVisualState> = {};

  for (const id of Object.keys(galaxy.stars)) {
    const isCurrent = id === playerStore.starID;
    const isPlayerHere = isCurrent && !playerStore.isTraveling;

    const annotations: NodeAnnotation[] = [];
    if (isPlayerHere) {
      annotations.push({ type: "pulse" });
    }

    states[id] = {
      exploration: explorationStore.getExploration(id),
      selected: isCurrent,
      hovered: transientStore.hoveredNodeID === id,
      annotations,
    };
  }
  return states;
});

// Single player traveler
const travelers = computed<Traveler[]>(() => [
  {
    id: "player",
    label: "Player",
    imageURL: "/spaceships/P-blue-a.png",
    nodeID: playerStore.starID,
    destNodeID: playerStore.destStarID,
    progress: playerStore.progress,
  },
]);
</script>

<style>
.MapContainer {
  width: 100%;
  height: 100%;
}
</style>
