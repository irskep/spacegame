<template>
  <div class="HUD">
    <Button
      :selected="uiStateStore.activeView === 'galaxy'"
      @click="uiStateStore.activeView = 'galaxy'"
    >
      Galaxy
    </Button>
    <Button
      :selected="uiStateStore.activeView === 'system'"
      @click="uiStateStore.activeView = 'system'"
    >
      System
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@spacegame/design-system";
import { useUIStateStore } from "@/stores/uiStateStore";
const uiStateStore = useUIStateStore();
</script>

<style>
.HUD {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}
</style>
