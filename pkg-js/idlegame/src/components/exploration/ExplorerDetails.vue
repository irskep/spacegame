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
      {{ star?.name }} &rarr; {{ destStar.name }}
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
import { computed } from 'vue'
import { useGalaxyStore } from '@/stores/galaxy'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const props = defineProps<{
  explorerID: string
}>()

const galaxyStore = useGalaxyStore()

const explorer = computed(() => {
  // Force reactivity
  galaxyStore.animationHandle
  galaxyStore.timerHandle
  return galaxyStore.explorers[props.explorerID]
})

const star = computed(() => {
  if (!explorer.value) return null
  return galaxyStore.starInfo[explorer.value.starID]
})

const destStar = computed(() => {
  if (!explorer.value?.destinationStarID) return null
  return galaxyStore.starInfo[explorer.value.destinationStarID]
})
</script>

<style scoped>
img.Spaceship.m-large {
  height: 64px;
  width: auto;
}
</style>
