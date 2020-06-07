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

    <circle
      class="Starmap_Star_Govt"
      v-for="star in Object.values(galaxy.stars)"
      :key="star.id + '2'"
      :id="star.id"
      :cx="star.point.x"
      :cy="star.point.y"
      :r="10"
      :fill="getStarColor(star)"
      fill-opacity="0.7"
    ></circle>

    <circle
      class="Starmap_Star"
      v-for="star in Object.values(galaxy.stars)"
      :key="star.id"
      :id="star.id"
      :cx="star.point.x"
      :cy="star.point.y"
      :r="5"
      fill="black"
      stroke="white"
    ></circle>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { generateStars } from "@/game/stargen";
import { Galaxy } from "@/game/Galaxy";
import { Star } from "@/game/types";
import { Govt } from "@/game/govts";
import { GameState } from "../store";

function log<T>(label: string, obj: T, enable = true): T {
  if (!enable) return obj;
  console.log(label, obj);
  return obj;
}

const x = namespace("game");

@Component
export default class Starmap extends Vue {
  @x.State seed!: string;
  @x.Getter govtMap!: Record<string, Govt>;
  @x.Getter galaxy!: Galaxy;

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

  @x.Mutation("newRandomSeed") click!: () => void;
}
</script>

<style lang="scss">
.Starmap {
  position: relative;
  background-color: black;
  border: 1px solid blue;
}

.Starmap_Star:hover {
  stroke: yellow;
  fill: #333;
  cursor: pointer;
}
</style>
