<template>
  <div class="App">
    <ModalContainer />

    <div class="HUD">
      <Button :selected="activeView === 'galaxy'" @click="activeView = 'galaxy'">
        Galaxy
      </Button>
      <Button :selected="activeView === 'system'" @click="activeView = 'system'">
        System
      </Button>
    </div>

    <Button class="ResetButton" @click="galaxyStore.reset">Reset</Button>

    <PanContainer
      v-if="activeView === 'galaxy'"
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

    <template v-else>
      <component
        :is="ActiveSystemView"
        :star="currentSystem.stars[0]"
        :planets="currentSystem.planets"
        :habitableZoneMin="currentSystem.habitableZoneMin"
        :habitableZoneMax="currentSystem.habitableZoneMax"
        :seed="playerStore.starID"
      />
      <PanelGroup class="m-hud-right">
        <Panel>
          <PlanetList
            :starName="currentStarName"
            :planets="currentSystem.planets"
            :habitableZoneMin="currentSystem.habitableZoneMin"
            :habitableZoneMax="currentSystem.habitableZoneMax"
          />
        </Panel>
      </PanelGroup>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button, Panel, PanelGroup } from "@spacegame/design-system";
import { getStarSystem, lerp, type Vector2 } from "@spacegame/galaxygen";
import {
  type Edge,
  type Node,
  type NodeAnnotation,
  type NodeVisualState,
  PanContainer,
  Starmap,
  SystemView,
  SystemViewSVG,
  type Traveler,
  USE_SVG_SYSTEM_VIEW,
} from "@spacegame/galaxyrender";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import ModalContainer from "./components/ModalContainer.vue";
import PlanetList from "./components/PlanetList.vue";
import { useExplorationStore } from "./stores/explorationStore";
import { useGalaxyStore } from "./stores/galaxyStore";
import { useModalStore } from "./stores/modalStore";
import { usePlayerStore } from "./stores/playerStore";
import { useTransientStore } from "./stores/transientStore";

const ActiveSystemView = USE_SVG_SYSTEM_VIEW ? SystemViewSVG : SystemView;
const galaxyStore = useGalaxyStore();
const playerStore = usePlayerStore();
const transientStore = useTransientStore();
const modalStore = useModalStore();
const explorationStore = useExplorationStore();

const TRAVEL_SPEED = 0.5; // progress per second

const { galaxy, starData } = galaxyStore;

// Initialize exploration: all stars discovered, home star system explored
for (const id of Object.keys(galaxy.stars)) {
  explorationStore.setExploration(id, "discovered");
}
explorationStore.setExploration(galaxy.homeStarID, "systemExplored");
for (const neighborID of galaxy.getNeighborIDs(galaxy.homeStarID)) {
  explorationStore.setExploration(neighborID, "starExplored");
}

// UI state
const activeView = ref<"galaxy" | "system">("galaxy");
const imageSizes = ref<Record<string, Vector2>>({});

// Current star system (for System view)
const currentSystem = computed(() => getStarSystem(playerStore.starID));
const currentStarName = computed(
  () => starData[playerStore.starID]?.name ?? "Unknown",
);

// Animation
let animationHandle = 0;
let lastTime: number | null = null;

function tick(time: number) {
  if (lastTime !== null) {
    const dt = (time - lastTime) / 1000;
    playerStore.tick(dt, TRAVEL_SPEED);
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

// Update exploration when player arrives at a new star
watch(
  () => playerStore.starID,
  (newStarID) => {
    explorationStore.setExploration(newStarID, "systemExplored");
    for (const neighborID of galaxy.getNeighborIDs(newStarID)) {
      // Only upgrade to starExplored if not already systemExplored
      if (explorationStore.getExploration(neighborID) !== "systemExplored") {
        explorationStore.setExploration(neighborID, "starExplored");
      }
    }
  },
);

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

.HUD {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.ResetButton {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
}

.SystemView {
  width: 100%;
  height: 100%;
}
</style>
