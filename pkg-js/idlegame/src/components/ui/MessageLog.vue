<template>
  <div class="MessageLog">
    <h6>Message Log</h6>
    <p v-for="m in indexedMessages" :key="m.index">{{ m.text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGalaxyStore } from "@/stores/galaxy";

const galaxyStore = useGalaxyStore();

const indexedMessages = computed(() =>
  galaxyStore.messages.slice(0, 10).map((text, index) => ({ index, text })),
);
</script>

<style>
.MessageLog {
  text-align: right;
}
</style>
