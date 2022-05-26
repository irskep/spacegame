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
      :class="{ 'm-travelable': getMayTravel(star) }"
      v-for="star in Object.values(galaxy.stars)"
      :key="star.id + '2'"
      :id="star.id"
      data-id="star.id"
      v-on:click="travel(star)"
      v-on:mouseenter="setHoveredStar(star)"
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

      <circle
        v-if="star.id === playerLocationStarID"
        :cx="star.point.x"
        :cy="star.point.y"
        :r="15"
        stroke="lightgreen"
        fill="transparent"
        class="pulse"
      ></circle>
    </g>

    <text
      class="Starmap_Star_Label"
      v-if="hoveredStar"
      :x="Math.max(2, hoveredStar.point.x - 40)"
      :y="Math.max(2, hoveredStar.point.y - 20)"
    >
      {{ getStarName(hoveredStar) }}
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { GalaxyState } from "@/store/types";

import { Galaxy } from "@/game/exploration/types/Galaxy";
import { Star } from "@/game/exploration/types/Star";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { StarMetadataMap } from "@/game/exploration/gen/StarMetadataSystem";

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

@Component
export default class Starmap extends Vue {
  @x.State seed!: string;
  @x.State playerLocationStarID!: string;
  @x.Getter govtMap!: GovtMap;
  @x.Getter metadataMap!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;
  hoveredStar: Star | null = null;

  get state(): GalaxyState {
    return this.$store.state.galaxy as GalaxyState;
  }

  get allNeighbors(): [Star, Star][] {
    return log("allNeighbors", this.galaxy.getAllNeighbors(), false);
  }

  getStarColor(s: Star): string {
    if (!this.govtMap[s.id]) return "#616161";
    return this.govtMap[s.id].color;
  }

  getStarName(s: Star): string {
    if (!this.metadataMap[s.id]) return "unknown";
    return this.metadataMap[s.id].name;
  }

  getMayTravel(star: Star) {
    return this.galaxy.getIsConnected(star.id, this.playerLocationStarID);
  }

  getIsHoveredEdge(pair: [Star, Star]) {
    const isOnA =
      pair[0].id === this.playerLocationStarID ||
      pair[1].id === this.playerLocationStarID;
    const isOnB =
      pair[0].id === this.hoveredStar?.id ||
      pair[1].id === this.hoveredStar?.id;
    return isOnA && isOnB;
  }

  setHoveredStar(star: Star | null) {
    this.hoveredStar = star;
  }

  travel(star: Star) {
    if (!this.galaxy.getIsConnected(star.id, this.playerLocationStarID)) return;
    this.$store.commit("galaxy/travel", star.id);
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
