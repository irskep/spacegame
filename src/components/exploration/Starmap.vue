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
      :class="{ 'm-active': getIsHoveredEdge(pair) }"
      stroke="gray"
    ></line>

    <g
      class="Starmap_Star"
      :class="{ 'm-travelable': getMayTravel(star.id) }"
      v-for="star in Object.values(galaxy.stars)"
      :key="star.id + '2'"
      :id="star.id"
      data-id="star.id"
      v-on:click="setSelectedStar(star.id)"
      v-on:mouseenter="setHoveredStar(star.id)"
      v-on:mouseleave="setHoveredStar(null)"
    >
      <circle
        class="Starmap_Star_Govt"
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
      <circle
        :class="{ pulse: getIsExplorerSelected(explorer) }"
        :cx="getExplorerPoint(explorer).x"
        :cy="getExplorerPoint(explorer).y - 17"
        :r="7"
        stroke="white"
        fill="black"
      ></circle>

      <line
        :x1="getExplorerPoint(explorer).x"
        :y1="getExplorerPoint(explorer).y - 10"
        :x2="getExplorerPoint(explorer).x"
        :y2="getExplorerPoint(explorer).y"
        class="Edge"
        stroke="white"
      ></line>
    </g>

    <text
      class="Starmap_Star_Label"
      v-if="hoveredStar"
      :x="Math.max(2, hoveredStar.point.x - 40)"
      :y="Math.max(2, hoveredStar.point.y - 20)"
    >
      {{ getStarName(hoveredStarID) }}
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

/**
 * Simple function that lets you log one object in the middle of an expression.
 * Can be disabled by setting enable=false.
 */
function log<T>(label: string, obj: T, enable = true): T {
  if (!enable) return obj;
  console.log(label, obj);
  return obj;
}

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
    return log("allNeighbors", this.galaxy.getAllNeighbors(), false);
  }

  get hoveredStar(): Star | null {
    if (!this.hoveredStarID) return null;
    return this.galaxy.stars[this.hoveredStarID];
  }

  getStarColor(s: Star): string {
    if (!this.govtInfo[s.id]) return "#616161";
    return this.govtInfo[s.id].color;
  }

  getStarName(s: string): string {
    if (!this.starInfo[s]) return "unknown";
    return this.starInfo[s].name;
  }

  getMayTravel(starID: string) {
    return true;
    // return this.galaxy.getIsConnected(star.id, this.playerLocationStarID);
  }

  getHasExplorer(starID: string): boolean {
    for (const e of Object.values(this.explorers)) {
      if (e.starID == starID) return true;
    }
    return false;
  }

  getIsHoveredEdge(pair: [Star, Star]) {
    return false;
    // const isOnA =
    // pair[0].id === this.playerLocationStarID ||
    // pair[1].id === this.playerLocationStarID;
    // const isOnB =
    // pair[0].id === this.hoveredStar?.id ||
    // pair[1].id === this.hoveredStar?.id;
    // return isOnA && isOnB;
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

.Starmap_Star:hover text {
  visibility: visible;
}

.Starmap_Star:hover.m-travelable circle {
  cursor: pointer;
}

.Starmap_Star:hover circle.Starmap_Star_Inner {
  stroke: yellow;
  fill: #333;
}

.Starmap_ExplorerIndicator {
  cursor: pointer;
}

.pulse {
  animation-duration: 3s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    r: 12px;
  }
  50% {
    r: 20px;
  }
  100% {
    r: 12px;
  }
}
</style>
