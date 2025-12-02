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
import { useUIStateStore } from "@/stores/uiStateStore";
import useTick from "./useTick";
import useBasicExplorationPolicy from "./useBasicExplorationPolicy";
import { useExplorationStore } from "./stores/explorationStore";
import { useGalaxyStore } from "./stores/galaxyStore";
import { watch } from "vue";

const galaxyStore = useGalaxyStore();
const explorationStore = useExplorationStore();
const uiStateStore = useUIStateStore();

watch(
  () => galaxyStore.seed,
  () => explorationStore.reset()
);

useTick();
useBasicExplorationPolicy();
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  background: black;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.App {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
