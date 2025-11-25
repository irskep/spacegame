<template>
  <div class="ExplorerList">
    <p
      class="ExplorerList_Item"
      v-for="explorer of Object.values(explorers)"
      :key="explorer.id"
      @click="emit('selectExplorer', explorer.id)"
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
import { InlineProgressBar } from "@spacegame/design-system";
import type { Explorer } from "@spacegame/galaxygen";

const props = defineProps<{
  explorers: Record<string, Explorer>;
  animationHandle: number;
}>();

const emit = defineEmits<{
  selectExplorer: [explorerID: string];
}>();

function getExplorerProgress(e: Explorer): number {
  // Force reactivity by accessing animation handle
  props.animationHandle;

  switch (e.state) {
    case "traveling":
      return e.travelProgress;
    case "scanning":
      return e.scanProgress;
  }
}

function getExplorerColor(e: Explorer): string {
  return {
    traveling: "lightblue",
    scanning: "lightgreen",
  }[e.state];
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
