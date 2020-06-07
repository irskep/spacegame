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
import { Component, Prop, Vue } from "vue-property-decorator";
import { createDecorator } from "vue-class-component";
import { State, namespace } from "vuex-class";

import { RootState } from "../store";
import { generateStars, Galaxy, Star } from "../game/stargen";

function log<T>(label: string, obj: T, enable = true): T {
  if (!enable) return obj;
  console.log(label, obj);
  return obj;
}

const x = namespace("game");

@Component
export default class Starmap extends Vue {
  @x.State seed!: string;

  get galaxy(): Galaxy {
    return log("Galaxy", generateStars(this.seed));
  }

  get allNeighbors(): [Star, Star][] {
    return log("allNeighbors", this.galaxy.getAllNeighbors(), false);
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
