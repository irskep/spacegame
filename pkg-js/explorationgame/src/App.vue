<template>
  <div class="App">
    <ModalContainer />

    <HUD />

    <GalaxyView v-if="uiStateStore.activeView === 'galaxy'" />
    <SystemPrimaryView v-if="uiStateStore.activeView === 'system'" />
    <TechnologiesView v-if="uiStateStore.activeView === 'technologies'" />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import HUD from "@/components/hud/HUD.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import GalaxyView from "@/components/primaryviews/GalaxyView.vue";
import SystemPrimaryView from "@/components/primaryviews/SystemPrimaryView.vue";
import TechnologiesView from "@/components/primaryviews/TechnologiesView.vue";
import { useEventStore } from "@/stores/eventStore";
import { useTechStore } from "@/stores/techStore";
import { useUIStateStore } from "@/stores/uiStateStore";
import { useExplorationStore } from "./stores/explorationStore";
import { useGalaxyStore } from "./stores/galaxyStore";
import { usePlayerStore } from "./stores/playerStore";
import { allTechnologies, registerAllTechEffects } from "./technologies";
import useTick from "./useTick";

const galaxyStore = useGalaxyStore();
const explorationStore = useExplorationStore();
const uiStateStore = useUIStateStore();
const playerStore = usePlayerStore();
const eventStore = useEventStore();
const techStore = useTechStore();

// Register all technology effects
registerAllTechEffects(eventStore, techStore);

// Auto-unlock all technologies
for (const tech of allTechnologies) {
  techStore.unlock(tech.id);
}

// Reset exploration and tech when galaxy seed changes
watch(
  () => galaxyStore.seed,
  () => explorationStore.reset(),
);

// Emit playerArrivedAtStar event when player changes star
// Also mark the current star as systemExplored (core behavior)
watch(
  () => playerStore.starID,
  (newStarID) => {
    explorationStore.setExploration(newStarID, "systemExplored");
    eventStore.emit("playerArrivedAtStar", newStarID);
  },
);

useTick();
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
