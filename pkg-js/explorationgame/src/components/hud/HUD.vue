<template>
  <div>
    <TopNav />

    <Button class="ResetButton" @click="galaxyStore.reset">Reset</Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@spacegame/design-system";
import TopNav from "./TopNav.vue";
import { useGalaxyStore } from "@/stores/galaxyStore";
const galaxyStore = useGalaxyStore();
</script>

<style>
.ResetButton {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
}
</style>
