<template>
  <div class="Game">
    <DebugToolbar />
    <div class="Game_Inner">
      <PanContainer className="Map" :center="panContainerCenter">
        <Starmap
          :galaxy="galaxyStore.galaxy"
          :starInfo="galaxyStore.starInfo"
          :explorers="galaxyStore.explorers"
          :selectedStarID="uiStore.selectedStarID"
          :selectedExplorerID="uiStore.selectedExplorerID"
          :hoveredStarID="uiStore.hoveredStarID"
          :imageSizes="uiStore.imageSizes"
          :animationHandle="galaxyStore.animationHandle"
          @selectStar="uiStore.selectStar"
          @hoverStar="uiStore.hoverStar"
          @selectExplorer="uiStore.selectExplorer"
          @addImageSize="uiStore.addImageSize"
        />
      </PanContainer>
      <PanelGroup className="m-hud-left">
        <Panel>
          <ExplorerList
            :explorers="galaxyStore.explorers"
            :animationHandle="galaxyStore.animationHandle"
            @selectExplorer="uiStore.selectExplorer"
          />
        </Panel>
        <Panel v-if="selectedStar">
          <StarDetails :star="selectedStar" :planets="selectedStarPlanets" />
        </Panel>
        <Panel v-if="selectedExplorer">
          <ExplorerDetails
            :explorer="selectedExplorer"
            :currentStar="explorerCurrentStar"
            :destStar="explorerDestStar"
          />
        </Panel>
      </PanelGroup>
      <PanelGroup className="m-hud-right">
        <Panel><MessageLog :messages="galaxyStore.messages" /></Panel>
      </PanelGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageLog, Panel, PanelGroup } from "@spacegame/design-system";
import {
  ExplorerDetails,
  ExplorerList,
  PanContainer,
  StarDetails,
  Starmap,
} from "@spacegame/galaxyrender";
import { computed, onMounted } from "vue";
import DebugToolbar from "@/components/exploration/DebugToolbar.vue";
import { useGalaxyStore } from "@/stores/galaxy";
import { useUIStore } from "@/stores/ui";

const galaxyStore = useGalaxyStore();
const uiStore = useUIStore();

const panContainerCenter = { x: 350, y: 300 };

// Computed properties for selected items
const selectedStar = computed(() => {
  if (!uiStore.selectedStarID) return null;
  return galaxyStore.starInfo[uiStore.selectedStarID];
});

const selectedStarPlanets = computed(() => {
  if (!selectedStar.value) return [];
  return selectedStar.value.planetIDs.map((pid) => galaxyStore.planetInfo[pid]);
});

const selectedExplorer = computed(() => {
  if (!uiStore.selectedExplorerID) return null;
  return galaxyStore.explorers[uiStore.selectedExplorerID];
});

const explorerCurrentStar = computed(() => {
  if (!selectedExplorer.value) return null;
  return galaxyStore.starInfo[selectedExplorer.value.starID];
});

const explorerDestStar = computed(() => {
  if (!selectedExplorer.value?.destinationStarID) return null;
  return galaxyStore.starInfo[selectedExplorer.value.destinationStarID];
});

onMounted(() => {
  galaxyStore.ensureSeeded();
  galaxyStore.beginTick();
});
</script>

<style>
.UI h6 {
  margin: 0 0 0.5rem 0;
}

.UI p {
  margin-bottom: 0;
  font-size: 12px;
}

.Game {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
}
.Game_Inner {
  position: relative;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-grow: 100;
  flex-shrink: 0;
}

.ActiveStar {
  flex-grow: 1;
}

.Starmap {
  flex-shrink: 0;
  flex-grow: 0;
}

.Map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: black;
}

.m-hud-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
