<template>
  <svg class="Starmap" :width="galaxyStore.galaxy.size.x" :height="galaxyStore.galaxy.size.y">
    <line
      v-for="pair in allNeighbors"
      :key="`${pair[0].id}-${pair[1].id}`"
      :x1="pair[0].point.x"
      :y1="pair[0].point.y"
      :x2="pair[1].point.x"
      :y2="pair[1].point.y"
      class="Edge"
      stroke="gray"
    />

    <g
      class="Starmap_Star"
      v-for="star in allStars"
      :key="star.id + '2'"
      :id="star.id"
      data-id="star.id"
      @click="setSelectedStar(star.id)"
      @mouseenter="setHoveredStar(star.id)"
      @mouseleave="setHoveredStar(null)"
    >
      <circle
        class="Starmap_Star_Govt"
        :class="{ 'm-unexplored': !getIsExplored(star.id) }"
        :cx="star.point.x"
        :cy="star.point.y"
        :r="10"
        :fill="getStarColor(star)"
        fill-opacity="0.7"
      />

      <circle
        class="Starmap_Star_Inner"
        :cx="star.point.x"
        :cy="star.point.y"
        :r="5"
        fill="black"
        stroke="white"
      />
    </g>

    <g
      v-for="explorer of Object.values(galaxyStore.explorers)"
      :key="explorer.id"
      @click="setSelectedExplorer(explorer.id)"
      class="Starmap_ExplorerIndicator"
      :transform="`translate(${getExplorerPoint(explorer).x}, ${getExplorerPoint(explorer).y})`"
      :id="explorer.id"
    >
      <line
        :x1="0"
        :y1="-10"
        :x2="0"
        :y2="0"
        class="Edge"
        stroke="white"
      />

      <circle
        :class="{ pulse: getIsExplorerSelected(explorer) }"
        :cx="0"
        :cy="-23"
        :r="12"
        stroke="white"
        fill="black"
      />

      <circle :cx="0" :cy="-23" :r="12" stroke="white" fill="black" />

      <image
        :href="getSpaceshipURL(explorer)"
        :x="-getImageSize(getSpaceshipURL(explorer)).x / 2"
        :y="-23 - getImageSize(getSpaceshipURL(explorer)).y / 2"
        transform-origin="center"
        :width="getImageSize(getSpaceshipURL(explorer)).x"
        :height="getImageSize(getSpaceshipURL(explorer)).y"
      />
    </g>

    <text
      class="Starmap_Star_Label"
      v-if="hoveredStar && uiStore.hoveredStarID && getIsExplored(uiStore.hoveredStarID)"
      :x="Math.max(2, hoveredStar.point.x - 40)"
      :y="Math.max(2, hoveredStar.point.y - 20)"
    >
      {{ getStarName(uiStore.hoveredStarID) }}
    </text>

    <text
      class="Starmap_Explorer_Label"
      v-if="uiStore.selectedExplorerID && galaxyStore.explorers[uiStore.selectedExplorerID]"
      :x="Math.max(2, getExplorerPoint(galaxyStore.explorers[uiStore.selectedExplorerID]).x - 40)"
      :y="Math.max(2, getExplorerPoint(galaxyStore.explorers[uiStore.selectedExplorerID]).y - 30)"
    >
      {{ galaxyStore.explorers[uiStore.selectedExplorerID].name }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGalaxyStore } from '@/stores/galaxy'
import { useUIStore } from '@/stores/ui'
import type { Explorer } from '@/store/types'
import type { Star } from '@/game/exploration/types/Star'
import type { Vector2 } from '@/game/framework/Vector2'
import { scaleToHeight } from '@/game/framework/Vector2'
import { lerp } from '@/game/framework/util'

const galaxyStore = useGalaxyStore()
const uiStore = useUIStore()

const seenImages = ref(new Set<string>())

const allNeighbors = computed<[Star, Star][]>(() => {
  // Force reactivity
  galaxyStore.animationHandle
  galaxyStore.timerHandle

  return galaxyStore.galaxy
    .getAllNeighbors()
    .filter(([a, b]) => galaxyStore.starInfo[a.id] && galaxyStore.starInfo[b.id])
    .filter(
      ([a, b]) => galaxyStore.starInfo[a.id].known && galaxyStore.starInfo[b.id].known
    )
})

const allStars = computed<Star[]>(() => {
  return Object.values(galaxyStore.galaxy.stars).filter(
    (s) => galaxyStore.starInfo[s.id] && galaxyStore.starInfo[s.id].known
  )
})

const hoveredStar = computed<Star | null>(() => {
  if (!uiStore.hoveredStarID) return null
  return galaxyStore.galaxy.stars[uiStore.hoveredStarID]
})

function getSpaceshipURL(explorer: Explorer): string {
  return `/spaceships/${explorer.ship.image}`
}

function getImageSize(url: string): { x: number; y: number } {
  if (uiStore.imageSizes[url]) {
    return scaleToHeight(uiStore.imageSizes[url], 16)
  } else if (seenImages.value.has(url)) {
    return { x: 16, y: 16 }
  } else {
    seenImages.value.add(url)
    const img = new Image()
    img.onload = () => {
      const size = { x: img.width, y: img.height }
      uiStore.addImageSize(url, size)
    }
    img.src = url
    return { x: 16, y: 16 }
  }
}

function getIsExplored(sid: string): boolean {
  return galaxyStore.starInfo[sid] && galaxyStore.starInfo[sid].explored
}

function getStarColor(s: Star): string {
  const info = galaxyStore.starInfo[s.id]
  if (!info.explored) return 'transparent'

  if (info.buildings.length > 0) {
    return '#CB4FA2'
  }

  if (info.hasTerranHabitable) {
    return 'lightgreen'
  }

  return '#616161'
}

function getStarName(sid: string): string {
  if (!galaxyStore.starInfo[sid]) return 'unknown'
  return galaxyStore.starInfo[sid].name
}

function getExplorerPoint(e: Explorer): Vector2 {
  const star = galaxyStore.galaxy.stars[e.starID]
  if (!star) return { x: 0, y: 0 }
  if (e.destinationStarID) {
    const destStar = galaxyStore.galaxy.stars[e.destinationStarID]
    return lerp(star.point, destStar.point, e.travelProgress)
  } else {
    return star.point
  }
}

function getIsExplorerSelected(e: Explorer): boolean {
  return uiStore.selectedExplorerID === e.id
}

// UI events
function setHoveredStar(starID: string | null) {
  uiStore.hoverStar(starID)
}

function setSelectedStar(starID: string | null) {
  if (starID) {
    console.log(galaxyStore.starInfo[starID])
    console.log(
      galaxyStore.starInfo[starID].planetIDs.map((p) => galaxyStore.planetInfo[p])
    )
  }
  uiStore.selectStar(starID)
}

function setSelectedExplorer(explorerID: string | null) {
  uiStore.selectExplorer(explorerID)
}
</script>

<style scoped>
.Starmap {
  position: relative;
  background-color: black;
}

.Starmap .Edge.m-active {
  stroke: white;
  stroke-width: 2px;
}

.Starmap_Star_Label {
  fill: white;
  font-weight: bold;
}

.Starmap_Explorer_Label {
  fill: white;
}

.Starmap_Star:hover text {
  visibility: visible;
}

.Starmap_Star:hover circle.Starmap_Star_Inner {
  stroke: yellow;
  fill: #333;
}

.Starmap_ExplorerIndicator {
  cursor: pointer;
}

.pulse {
  animation-duration: 2s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    r: 9px;
  }
  50% {
    r: 15px;
  }
  100% {
    r: 9px;
  }
}
</style>
