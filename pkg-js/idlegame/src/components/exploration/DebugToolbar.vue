<template>
  <div class="DebugToolbar">
    <button @click="newSeed">New seed</button>
    <button @click="resetState">Reset state</button>
    <button @click="pause">Pause</button>
    <button @click="resume">Resume</button>
  </div>
</template>

<script setup lang="ts">
import { useGalaxyStore } from "@/stores/galaxy";

const galaxyStore = useGalaxyStore();

function newSeed() {
  galaxyStore.newRandomSeed();
}

function resetState() {
  galaxyStore.stopTick();
  localStorage.removeItem("galaxy");
  window.location.reload();
}

function pause() {
  galaxyStore.stopTick();
}

function resume() {
  galaxyStore.beginTick();
}
</script>

<style>
.DebugToolbar {
  background-color: black;
  padding: 0 5px 5px 5px;
}
</style>
