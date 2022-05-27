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
      :id="explorer.id"
    >
      <line
        :x1="getExplorerPoint(explorer).x"
        :y1="getExplorerPoint(explorer).y - 10"
        :x2="getExplorerPoint(explorer).x"
        :y2="getExplorerPoint(explorer).y"
        class="Edge"
        stroke="white"
      ></line>

      <circle
        :class="{ pulse: getIsExplorerSelected(explorer) }"
        :cx="getExplorerPoint(explorer).x"
        :cy="getExplorerPoint(explorer).y - 23"
        :r="12"
        stroke="white"
        fill="black"
      ></circle>

      <circle
        :cx="getExplorerPoint(explorer).x"
        :cy="getExplorerPoint(explorer).y - 23"
        :r="12"
        stroke="white"
        fill="black"
      ></circle>

      <image
        :href="`/spaceships/${explorer.ship.image}`"
        :x="getExplorerPoint(explorer).x"
        :y="getExplorerPoint(explorer).y - 10"
        transform="translate(-8, -22)"
        transform-origin="center"
        height="16"
      ></image>
    </g>

    <text
      class="Starmap_Star_Label"
      v-if="hoveredStar"
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
import { Vector2 } from "@/game/framework/Vector2";
import { lerp } from "@/game/framework/util";

const x = namespace("galaxy");
const ui = namespace("ui");

@Component
export default class Starmap extends Vue {
  @x.State seed!: string;
  @x.State govtInfo!: GovtMap;
  @x.State starInfo!: StarMetadataMap;
  @x.State explorers!: Record<string, Explorer>;
  @x.Getter galaxy!: Galaxy;

  @ui.State hoveredStarID!: string | null;
  @ui.State selectedExplorerID!: string | null;

  get state(): GalaxyState {
    return this.$store.state.galaxy as GalaxyState;
  }

  get allNeighbors(): [Star, Star][] {
    return this.galaxy
      .getAllNeighbors()
      .filter(
        ([a, b]) => this.starInfo[a.id].known && this.starInfo[b.id].known
      );
  }

  get allStars(): Star[] {
    return Object.values(this.galaxy.stars).filter(
      (s) => this.starInfo[s.id].known
    );
  }

  get hoveredStar(): Star | null {
    if (!this.hoveredStarID) return null;
    return this.galaxy.stars[this.hoveredStarID];
  }

  getIsKnown(sid: string): boolean {
    return this.starInfo[sid].known;
  }

  getIsExplored(sid: string): boolean {
    return this.starInfo[sid].explored;
  }

  getStarColor(s: Star): string {
    if (!this.govtInfo[s.id] || !this.getIsExplored(s.id)) return "#616161";
    return this.govtInfo[s.id].color;
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
