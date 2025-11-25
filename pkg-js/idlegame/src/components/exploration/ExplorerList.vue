<template>
  <div class="ExplorerList">
    <p
      class="ExplorerList_Item"
      v-for="explorer of Object.values(galaxyStore.explorers)"
      :key="explorer.id"
      @click="selectExplorer(explorer.id)"
    >
      <strong>{{ explorer.name }}:</strong> {{ explorer.state }}
      <InlineProgressBar
        :progress="getExplorerProgress(explorer)"
        :color="getExplorerColor(explorer)"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import { useGalaxyStore } from '@/stores/galaxy'
import { useUIStore } from '@/stores/ui'
import InlineProgressBar from '@/components/ui/InlineProgressBar.vue'
import type { Explorer } from '@/store/types'

const galaxyStore = useGalaxyStore()
const uiStore = useUIStore()

function getExplorerProgress(e: Explorer): number {
  // Force reactivity by accessing animation handles
  galaxyStore.animationHandle
  galaxyStore.timerHandle

  switch (e.state) {
    case 'traveling':
      return e.travelProgress
    case 'scanning':
      return e.scanProgress
  }
}

function getExplorerColor(e: Explorer): string {
  return {
    traveling: 'lightblue',
    scanning: 'lightgreen',
  }[e.state]
}

function selectExplorer(eid: string) {
  uiStore.selectExplorer(eid)
}
</script>

<style scoped>
.ExplorerList_Item {
  cursor: pointer;
}

.ExplorerList_Item:hover {
  background-color: #444;
}
</style>
