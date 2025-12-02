<template>
  <div class="App">
    <ModalContainer />

    <HUD />

    <GalaxyView v-if="uiStateStore.activeView === 'galaxy'" />
    <SystemPrimaryView v-if="uiStateStore.activeView === 'system'" />
  </div>
</template>

<script setup lang="ts">
import HUD from "@/components/hud/HUD.vue";
import GalaxyView from "@/components/primaryviews/GalaxyView.vue";
import SystemPrimaryView from "@/components/primaryviews/SystemPrimaryView.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { useExplorationStore } from "@/stores/explorationStore";
import { useGalaxyStore } from "@/stores/galaxyStore";
import { useUIStateStore } from "@/stores/uiStateStore";
import useTick from "./useTick";
import useBasicExplorationPolicy from "./useBasicExplorationPolicy";

const galaxyStore = useGalaxyStore();
const explorationStore = useExplorationStore();
const uiStateStore = useUIStateStore();

const { galaxy } = galaxyStore;

// Initialize exploration: all stars discovered, home star system explored
for (const id of Object.keys(galaxy.stars)) {
  explorationStore.setExploration(id, "discovered");
}
explorationStore.setExploration(galaxy.homeStarID, "systemExplored");
for (const neighborID of galaxy.getNeighborIDs(galaxy.homeStarID)) {
  explorationStore.setExploration(neighborID, "starExplored");
}

useTick();
useBasicExplorationPolicy();
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
</style>
