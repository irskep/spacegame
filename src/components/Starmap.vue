<template>
  <svg
    class="Starmap"
    :width="galaxy.size.x"
    :height="galaxy.size.y"
    v-on:click="click"
  >
    <line
      v-for="pair in allNeighbors"
      :key="`${pair[0].id}-${pair[1].id}`"
      :x1="pair[0].point.x"
      :y1="pair[0].point.y"
      :x2="pair[1].point.x"
      :y2="pair[1].point.y"
      stroke="gray"
    ></line>

    <g
      class="Starmap_Star"
      v-for="star in Object.values(galaxy.stars)"
      :key="star.id + '2'"
      :id="star.id"
      data-id="star.id"
      v-on:mouseenter="setActiveStar(star)"
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

    <text
      class="Starmap_Star_Label"
      v-if="activeStar"
      :x="activeStar.point.x - 40"
      :y="activeStar.point.y - 20"
    >
      {{ getStarName(activeStar) }}
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Galaxy } from "@/game/types/Galaxy";
import { Star } from "@/game/types/Star";
import { GameState } from "../store";
import { GovtMap } from "@/game/gen/govts";
import { StarMetadataMap } from "../game/gen/StarMetadataSystem";

/**
 * Simple function that lets you log one object in the middle of an expression.
 * Can be disabled by setting enable=false.
 */
function log<T>(label: string, obj: T, enable = true): T {
  if (!enable) return obj;
  console.log(label, obj);
  return obj;
}

const x = namespace("game");

@Component
export default class Starmap extends Vue {
  @x.State seed!: string;
  @x.Getter govtMap!: GovtMap;
  @x.Getter metadataMap!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;
  activeStar: Star | null = null;

  get state(): GameState {
    return this.$store.state as GameState;
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

  @x.Mutation("newRandomSeed") click!: () => void;

  setActiveStar(star: Star) {
    console.log("activate", star);
    this.activeStar = star;
  }
}
</script>

<style lang="scss" scoped>
.Starmap {
  position: relative;
  background-color: black;
  border: 1px solid blue;
}

.Starmap_Star_Label {
  fill: white;
  font-weight: bold;
}

.Starmap_Star:hover {
  text {
    visibility: visible;
  }

  circle {
    cursor: pointer;
  }

  circle.Starmap_Star_Inner {
    stroke: yellow;
    fill: #333;
  }
}
</style>
