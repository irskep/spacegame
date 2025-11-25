<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info?.name }}</h6>
    <p v-for="planet in planets" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGalaxyStore } from '@/stores/galaxy'
import type { PlanetInfo } from '@/store/types'

interface PlanetRollup {
  name: string
  planetType: string
  cssClass: Record<string, boolean>
}

const props = defineProps<{
  starID?: string
}>()

const galaxyStore = useGalaxyStore()

const info = computed(() => {
  if (!props.starID) return null
  return galaxyStore.starInfo[props.starID]
})

const planets = computed<PlanetRollup[]>(() => {
  const starInfo = info.value
  if (!starInfo || !starInfo.explored) return []

  const ordinals = [
    'First', 'Second', 'Third', 'Fourth', 'Fifth',
    'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
    'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth',
    'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth',
  ]

  return starInfo.planetIDs
    .map((pid: string) => galaxyStore.planetInfo[pid])
    .filter((p: PlanetInfo) => p.known)
    .map((p: PlanetInfo) => ({
      name: ordinals[p.index],
      planetType: p.type,
      cssClass: {
        Planet: true,
        [`m-${p.type}`]: true,
        'm-habitable': p.isTerranHabitable,
      },
    }))
})
</script>

<style scoped>
.Planet.m-Neptunian {
  color: teal;
}
.Planet.m-Terran {
  color: lightblue;
}
.Planet.m-Jovian {
  color: tan;
}
.Planet.m-Terran.m-habitable {
  color: lightgreen;
}
</style>
