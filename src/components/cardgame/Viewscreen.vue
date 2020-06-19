<template>
  <div :class="['Viewscreen', extraClass]">
    <div class="Title">Enemy:</div>
    <img class="ShipImage" :src="shipImage" />
  </div>
</template>

<script>
import { SPACESHIP_IMAGES } from "@/game/defs/shipGfx";
export default {
  name: "Viewscreen",
  props: {
    extraClass: {
      type: String,
      default: "",
    },
  },
  components: {},
  computed: {
    shipImage: function () {
      return `/spaceships/${SPACESHIP_IMAGES[0]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.Viewscreen {
  position: relative;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ShipImage {
  width: 50%;
}

.Title {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 2rem;
}
</style>
