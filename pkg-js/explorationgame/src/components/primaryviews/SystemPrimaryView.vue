<template>
  <SystemViewSVG
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

<script setup lang="ts">
import { Panel, PanelGroup } from "@spacegame/design-system";
import PlanetList from "@/components/PlanetList.vue";
import { SystemViewSVG } from "@spacegame/galaxyrender";

import { getStarSystem } from "@spacegame/galaxygen";
import { computed } from "vue";
import { useExplorationStore } from "@/stores/explorationStore";
import { useGalaxyStore } from "@/stores/galaxyStore";
import { usePlayerStore } from "@/stores/playerStore";

const galaxyStore = useGalaxyStore();
const playerStore = usePlayerStore();
const explorationStore = useExplorationStore();

const { galaxy, starData } = galaxyStore;

// Initialize exploration: all stars discovered, home star system explored
for (const id of Object.keys(galaxy.stars)) {
  explorationStore.setExploration(id, "discovered");
}
explorationStore.setExploration(galaxy.homeStarID, "systemExplored");
for (const neighborID of galaxy.getNeighborIDs(galaxy.homeStarID)) {
  explorationStore.setExploration(neighborID, "starExplored");
}

// Current star system (for System view)
const currentSystem = computed(() => getStarSystem(playerStore.starID));
const currentStarName = computed(
  () => starData[playerStore.starID]?.name ?? "Unknown"
);
</script>

<style></style>
