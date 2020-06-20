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
  max-width: 50%;
  max-height: 70%;
  transform: rotate(180deg);

  animation-duration: 3s;
  animation-name: float;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes float {
  0% {
    transform: translate(0, 0.5vw) rotate(180deg);
  }

  50% {
    transform: translate(0, -0.5vw) rotate(180deg);
  }

  100% {
    transform: translate(0, 0.5vw) rotate(180deg);
  }
}

.Title {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 2rem;
}
</style>
