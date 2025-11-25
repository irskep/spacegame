<template>
  <div class="Game">
    <DebugToolbar />
    <div class="Game_Inner">
      <PanContainer className="Map" :center="panContainerCenter">
        <Starmap />
      </PanContainer>
      <PanelGroup className="m-hud-left">
        <Panel><ExplorerList /></Panel>
        <Panel v-if="uiStore.selectedStarID">
          <StarDetails :starID="uiStore.selectedStarID" />
        </Panel>
        <Panel v-if="uiStore.selectedExplorerID">
          <ExplorerDetails :explorerID="uiStore.selectedExplorerID" />
        </Panel>
      </PanelGroup>
      <PanelGroup className="m-hud-right">
        <Panel><MessageLog /></Panel>
      </PanelGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGalaxyStore } from '@/stores/galaxy'
import { useUIStore } from '@/stores/ui'
import DebugToolbar from '@/components/exploration/DebugToolbar.vue'
import Starmap from '@/components/exploration/Starmap.vue'
import ExplorerDetails from '@/components/exploration/ExplorerDetails.vue'
import ExplorerList from '@/components/exploration/ExplorerList.vue'
import StarDetails from '@/components/exploration/StarDetails.vue'
import PanContainer from '@/components/exploration/PanContainer.vue'
import Panel from '@/components/ui/Panel.vue'
import PanelGroup from '@/components/ui/PanelGroup.vue'
import MessageLog from '@/components/ui/MessageLog.vue'

const galaxyStore = useGalaxyStore()
const uiStore = useUIStore()

const panContainerCenter = { x: 350, y: 300 }

onMounted(() => {
  galaxyStore.ensureSeeded()
  galaxyStore.beginTick()
})
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
