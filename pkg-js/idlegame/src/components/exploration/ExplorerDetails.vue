<template>
  <div class="ExplorerDetails" v-if="explorer">
    <h6>{{ explorer.name }}</h6>
    <img
      class="Spaceship m-large"
      :src="`/spaceships/${explorer.ship.image}`"
    />
    <p
      v-if="
        explorer.state === 'scanning' &&
        explorer.scannable &&
        explorer.scannable.kind === 'planet'
      "
    >
      Scanning planet {{ explorer.scannable.text }}
    </p>
    <p
      v-if="
        explorer.state === 'scanning' &&
        explorer.scannable &&
        explorer.scannable.kind === 'star'
      "
    >
      Scanning neighboring star {{ explorer.scannable.text }}
    </p>
    <ProgressBar
      v-if="explorer.state === 'scanning'"
      color="lightgreen"
      :progress="explorer.scanProgress"
    />
    <p v-if="explorer.state === 'traveling' && destStar">
      {{ currentStar?.name }} &rarr; {{ destStar.name }}
    </p>
    <ProgressBar
      v-if="explorer.state === 'traveling'"
      color="lightblue"
      :progress="explorer.travelProgress"
    />
    <p v-for="crew in explorer.crew" :key="crew.id">
      {{ crew.role }}: {{ crew.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ProgressBar } from "@spacegame/design-system";
import type { StarMetadata } from "@spacegame/galaxygen";
import type { Explorer } from "@/types";

defineProps<{
  explorer: Explorer;
  currentStar: StarMetadata | null;
  destStar: StarMetadata | null;
}>();
</script>

<style scoped>
img.Spaceship.m-large {
  height: 64px;
  width: auto;
}
</style>
