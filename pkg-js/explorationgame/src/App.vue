<template>
  <div class="App">
    <div class="HUD">
      <Button :selected="activeView === 'galaxy'" @click="activeView = 'galaxy'">
        Galaxy
      </Button>
      <Button :selected="activeView === 'system'" @click="activeView = 'system'">
        System
      </Button>
    </div>

    <Button class="ResetButton" @click="reset">Reset</Button>

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
        :hoveredNodeID="hoveredNodeID"
        :imageSizes="imageSizes"
        :size="galaxy.size"
        @selectNode="onSelectNode"
        @hoverNode="(id) => (hoveredNodeID = id)"
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
        :seed="playerStarID"
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
import {
  type Galaxy,
  generateHomeStarSystem,
  generateStars,
  getStarSystem,
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
  SystemView,
  SystemViewSVG,
  type Traveler,
  USE_SVG_SYSTEM_VIEW,
} from "@spacegame/galaxyrender";
import { computed, onMounted, onUnmounted, ref } from "vue";
import PlanetList from "./components/PlanetList.vue";

const ActiveSystemView = USE_SVG_SYSTEM_VIEW ? SystemViewSVG : SystemView;

const TRAVEL_SPEED = 0.5; // progress per second

function getSeed(): string {
  let seed = localStorage.getItem("galaxySeed");
  if (!seed) {
    seed = `galaxy-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("galaxySeed", seed);
  }
  return seed;
}

const SEED = getSeed();

function reset() {
  localStorage.clear();
  window.location.reload();
}

const galaxy: Galaxy = generateStars(SEED);
generateHomeStarSystem(galaxy.homeStarID); // Ensure home star has 4+ planets with habitable zone
const starData = StarDataSystem.makeData(SEED, galaxy);

// UI state
const activeView = ref<"galaxy" | "system">("galaxy");
const hoveredNodeID = ref<string | null>(null);
const imageSizes = ref<Record<string, Vector2>>({});

// Player state
const playerStarID = ref(galaxy.homeStarID);
const playerDestStarID = ref<string | null>(null);
const playerProgress = ref(0);

// Current star system (for System view)
const currentSystem = computed(() => getStarSystem(playerStarID.value));
const currentStarName = computed(
  () => starData[playerStarID.value]?.name ?? "Unknown",
);

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

// Computed: center for PanContainer
const playerCenter = computed<Vector2>(() => playerPosition.value);

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

    // Exploration level: current = systemExplored, adjacent = starExplored, others = discovered
    let exploration: "discovered" | "starExplored" | "systemExplored" =
      "discovered";
    if (isCurrent) {
      exploration = "systemExplored";
    } else if (isAdjacent) {
      exploration = "starExplored";
    }

    states[id] = {
      exploration,
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
