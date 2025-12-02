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
import { computed } from "vue";

import { Panel, PanelGroup } from "@spacegame/design-system";
import PlanetList from "@/components/PlanetList.vue";
import { SystemViewSVG } from "@spacegame/galaxyrender";

import { getStarSystem } from "@spacegame/galaxygen";
import { useGalaxyStore } from "@/stores/galaxyStore";
import { usePlayerStore } from "@/stores/playerStore";

const galaxyStore = useGalaxyStore();
const playerStore = usePlayerStore();

const { starData } = galaxyStore;

// Current star system (for System view)
const currentSystem = computed(() => getStarSystem(playerStore.starID));
const currentStarName = computed(
  () => starData[playerStore.starID]?.name ?? "Unknown"
);
</script>

<style></style>
