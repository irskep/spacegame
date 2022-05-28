<template>
  <svg class="Starmap" :width="galaxy.size.x" :height="galaxy.size.y">
    <line
      v-for="pair in allNeighbors"
      :key="`${pair[0].id}-${pair[1].id}`"
      :x1="pair[0].point.x"
      :y1="pair[0].point.y"
      :x2="pair[1].point.x"
      :y2="pair[1].point.y"
      class="Edge"
      stroke="gray"
    ></line>

    <g
      class="Starmap_Star"
      v-for="star in allStars"
      :key="star.id + '2'"
      :id="star.id"
      data-id="star.id"
      v-on:click="setSelectedStar(star.id)"
      v-on:mouseenter="setHoveredStar(star.id)"
      v-on:mouseleave="setHoveredStar(null)"
    >
      <circle
        class="Starmap_Star_Govt"
        :class="{ 'm-unexplored': !getIsExplored(star.id) }"
        :cx="star.point.x"
        :cy="star.point.y"
        :r="10"
        :fill="getStarColor(star)"
        fill-opacity="0.7"
      ></circle>

      <circle
        class="Starmap_Star_Inner"
        :cx="star.point.x"
        :cy="star.point.y"
        :r="5"
        fill="black"
        stroke="white"
      ></circle>
    </g>

    <g
      v-for="explorer of Object.values(explorers)"
      v-bind:key="explorer.id"
      v-on:click="setSelectedExplorer(explorer.id)"
      class="Starmap_ExplorerIndicator"
      :transform="`translate(${getExplorerPoint(explorer).x}, ${
        getExplorerPoint(explorer).y
      })`"
      :id="explorer.id"
    >
      <line
        :x1="0"
        :y1="-10"
        :x2="0"
        :y2="0"
        class="Edge"
        stroke="white"
      ></line>

      <circle
        :class="{ pulse: getIsExplorerSelected(explorer) }"
        :cx="0"
        :cy="-23"
        :r="12"
        stroke="white"
        fill="black"
      ></circle>

      <circle :cx="0" :cy="-23" :r="12" stroke="white" fill="black"></circle>

      <image
        :href="getSpaceshipURL(explorer)"
        :x="-getImageSize(getSpaceshipURL(explorer)).x / 2"
        :y="-23 - getImageSize(getSpaceshipURL(explorer)).y / 2"
        transform-origin="center"
        :width="getImageSize(getSpaceshipURL(explorer)).x"
        :height="getImageSize(getSpaceshipURL(explorer)).y"
      ></image>
    </g>

    <text
      class="Starmap_Star_Label"
      v-if="hoveredStar && getIsExplored(hoveredStarID)"
      :x="Math.max(2, hoveredStar.point.x - 40)"
      :y="Math.max(2, hoveredStar.point.y - 20)"
    >
      {{ getStarName(hoveredStarID) }}
    </text>

    <text
      class="Starmap_Explorer_Label"
      v-if="selectedExplorerID"
      :x="Math.max(2, getExplorerPoint(explorers[selectedExplorerID]).x - 40)"
      :y="Math.max(2, getExplorerPoint(explorers[selectedExplorerID]).y - 30)"
    >
      {{ explorers[selectedExplorerID].name }}
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Explorer, GalaxyState } from "@/store/types";

import { Galaxy } from "@/game/exploration/types/Galaxy";
import { Star } from "@/game/exploration/types/Star";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataMap } from "@/game/exploration/gen/StarMetadataSystem";
import { scaleToHeight, Vector2 } from "@/game/framework/Vector2";
import { lerp } from "@/game/framework/util";
import { getStarSystem } from "@/store/GalaxyModule";
import { getStarSystemFacts } from "@/game/exploration/types/spacefacts";

const x = namespace("galaxy");
const ui = namespace("ui");

@Component
export default class Starmap extends Vue {
  @x.State animationHandle!: number;
  @x.State seed!: string;
  @x.State govtInfo!: GovtMap;
  @x.State starInfo!: StarMetadataMap;
  @x.State explorers!: Record<string, Explorer>;
  @x.Getter galaxy!: Galaxy;

  @ui.State hoveredStarID!: string | null;
  @ui.State selectedExplorerID!: string | null;
  @ui.State imageSizes!: Record<string, Vector2>;

  seenImages = new Set<string>();

  get state(): GalaxyState {
    return this.$store.state.galaxy as GalaxyState;
  }

  get allNeighbors(): [Star, Star][] {
    // hack: watch animationHandle
    this.animationHandle;

    return this.galaxy
      .getAllNeighbors()
      .filter(([a, b]) => this.starInfo[a.id] && this.starInfo[b.id])
      .filter(
        ([a, b]) => this.starInfo[a.id].known && this.starInfo[b.id].known
      );
  }

  get allStars(): Star[] {
    return Object.values(this.galaxy.stars).filter(
      (s) => this.starInfo[s.id] && this.starInfo[s.id].known
    );
  }

  get hoveredStar(): Star | null {
    if (!this.hoveredStarID) return null;
    return this.galaxy.stars[this.hoveredStarID];
  }

  getSpaceshipURL(explorer: Explorer): string {
    return `/spaceships/${explorer.ship.image}`;
  }

  getImageSize(url: string): { x: string | number; y: string | number } {
    if (this.imageSizes[url]) {
      return scaleToHeight(this.imageSizes[url], 16);
    } else if (this.seenImages.has(url)) {
      return { x: 16, y: 16 };
    } else {
      this.seenImages.add(url);
      const img = new Image();
      img.onload = () => {
        const size = { x: img.width, y: img.height };
        console.log("Got image size:", { url, size });
        this.$store.commit("ui/addImageSize", { url, size });
      };
      img.src = url;
      return { x: 16, y: 16 };
    }
  }

  getIsKnown(sid: string): boolean {
    return this.starInfo[sid] && this.starInfo[sid].known;
  }

  getIsExplored(sid: string): boolean {
    return this.starInfo[sid] && this.starInfo[sid].explored;
  }

  getStarColor(s: Star): string {
    const info = this.starInfo[s.id];
    if (!info.explored) return "transparent";
    const starSystem = getStarSystem(s.id);

    if (info.buildings.length > 0) {
      return "#CB4FA2";
    }

    if (getStarSystemFacts(starSystem).hasHabitablePlanet) {
      return "lightgreen";
    }

    return "#616161";
    // if (!this.govtInfo[s.id] || !this.getIsExplored(s.id)) return "#616161";
    // return this.govtInfo[s.id].color;
  }

  getStarName(s: string): string {
    if (!this.starInfo[s]) return "unknown";
    return this.starInfo[s].name;
  }

  getHasExplorer(starID: string): boolean {
    for (const e of Object.values(this.explorers)) {
      if (e.starID == starID) return true;
    }
    return false;
  }

  getExplorerPoint(e: Explorer): Vector2 {
    const star = this.galaxy.stars[e.starID];
    if (!star) return { x: 0, y: 0 };
    if (e.destinationStarID) {
      const destStar = this.galaxy.stars[e.destinationStarID];
      return lerp(star.point, destStar.point, e.travelProgress);
    } else {
      return star.point;
    }
  }

  getIsExplorerSelected(e: Explorer): boolean {
    return this.selectedExplorerID == e.id;
  }

  // UI events

  setHoveredStar(starID: string | null) {
    this.$store.commit("ui/hoverStar", starID);
  }

  setSelectedStar(starID: string | null) {
    this.$store.commit("ui/selectStar", starID);
  }

  setSelectedExplorer(explorerID: string | null) {
    this.$store.commit("ui/selectExplorer", explorerID);
  }
}
</script>

<style lang="css" scoped>
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
  /* font-weight: bold; */
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
