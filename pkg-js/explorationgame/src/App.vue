<template>
  <div class="App">
    <PanContainer class="MapContainer" :center="playerCenter">
      <div class="MapScale">
        <Starmap
          :nodes="nodes"
          :edges="edges"
          :nodeVisualStates="nodeVisualStates"
          :travelers="travelers"
          :selectedNodeID="null"
          :selectedTravelerID="null"
          :hoveredNodeID="hoveredNodeID"
          :imageSizes="imageSizes"
          :size="galaxy.size"
          @selectNode="onSelectNode"
          @hoverNode="(id) => (hoveredNodeID = id)"
          @selectTraveler="() => {}"
          @addImageSize="onAddImageSize"
        />
      </div>
    </PanContainer>
  </div>
</template>

<script setup lang="ts">
import {
  type Galaxy,
  generateStars,
  lerp,
  StarDataSystem,
  type Vector2,
} from "@spacegame/galaxygen";
import {
  type Edge,
  type Node,
  type NodeVisualState,
  PanContainer,
  Starmap,
  type Traveler,
} from "@spacegame/galaxyrender";
import { computed, onMounted, onUnmounted, ref } from "vue";

const SEED = "exploration-demo";
const SCALE = 3;
const TRAVEL_SPEED = 0.5; // progress per second

const galaxy: Galaxy = generateStars(SEED);
const starData = StarDataSystem.makeData(SEED, galaxy);

// UI state
const hoveredNodeID = ref<string | null>(null);
const imageSizes = ref<Record<string, Vector2>>({});

// Player state
const playerStarID = ref(galaxy.homeStarID);
const playerDestStarID = ref<string | null>(null);
const playerProgress = ref(0);

// Animation
let animationHandle = 0;
let lastTime: number | null = null;

function tick(time: number) {
  if (lastTime !== null) {
    const dt = (time - lastTime) / 1000;

    if (playerDestStarID.value) {
      playerProgress.value += dt * TRAVEL_SPEED;

      if (playerProgress.value >= 1) {
        playerStarID.value = playerDestStarID.value;
        playerDestStarID.value = null;
        playerProgress.value = 0;
      }
    }
  }

  lastTime = time;
  animationHandle = requestAnimationFrame(tick);
}

onMounted(() => {
  animationHandle = requestAnimationFrame(tick);
});

onUnmounted(() => {
  if (animationHandle) {
    cancelAnimationFrame(animationHandle);
  }
});

// Computed: adjacent star IDs
const adjacentStarIDs = computed<Set<string>>(() => {
  return new Set(galaxy.getNeighborIDs(playerStarID.value));
});

// Computed: player's current visual position
const playerPosition = computed<Vector2>(() => {
  const currentStar = galaxy.stars[playerStarID.value];
  if (!currentStar) return { x: 0, y: 0 };

  if (playerDestStarID.value) {
    const destStar = galaxy.stars[playerDestStarID.value];
    if (destStar) {
      return lerp(currentStar.point, destStar.point, playerProgress.value);
    }
  }

  return currentStar.point;
});

// Computed: center for PanContainer (scaled)
const playerCenter = computed<Vector2>(() => ({
  x: playerPosition.value.x * SCALE,
  y: playerPosition.value.y * SCALE,
}));

// Handle node selection - navigate if adjacent
function onSelectNode(nodeID: string) {
  // Can't navigate while traveling
  if (playerDestStarID.value) return;

  // Can only navigate to adjacent stars
  if (!adjacentStarIDs.value.has(nodeID)) return;

  playerDestStarID.value = nodeID;
  playerProgress.value = 0;
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
  }));
});

// Map star connections to edges
const edges = computed<Edge[]>(() => {
  return galaxy.getAllNeighbors().map(([a, b]) => ({
    fromNodeID: a.id,
    toNodeID: b.id,
  }));
});

// Map to node visual states with adjacent highlighting
const nodeVisualStates = computed<Record<string, NodeVisualState>>(() => {
  const states: Record<string, NodeVisualState> = {};
  const adjacent = adjacentStarIDs.value;

  for (const id of Object.keys(galaxy.stars)) {
    const isAdjacent = adjacent.has(id);
    const isCurrent = id === playerStarID.value;

    let borderColor = "#616161";
    if (isCurrent) {
      borderColor = "#4488ff";
    } else if (isAdjacent) {
      borderColor = "#88ff88";
    }

    states[id] = {
      known: true,
      selected: isCurrent,
      hovered: hoveredNodeID.value === id,
      borderColor,
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
    nodeID: playerStarID.value,
    destNodeID: playerDestStarID.value,
    progress: playerProgress.value,
  },
]);
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: black;
  overflow: hidden;
}

.App {
  width: 100vw;
  height: 100vh;
}

.MapContainer {
  width: 100%;
  height: 100%;
}

.MapScale {
  transform: scale(3);
  transform-origin: top left;
}
</style>
