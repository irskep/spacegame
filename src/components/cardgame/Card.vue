<template>
  <div :class="['Card', sizeClass]">Card.</div>
</template>

<script>
export default {
  name: "Card",
  props: {
    size: {
      type: String,
      default: "large",
    },
  },
  components: {},
  computed: {
    sizeClass: function () {
      return `m-${this.size}`;
    },
  },
};
</script>

<style lang="scss">
.Card {
  border: 1px solid black;
  border-radius: 0.5vw;
  background-color: white;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &.m-tiny {
    width: 10vw;
    height: 15vw;
  }

  &.m-medium {
    width: 15vw;
    height: 22.5vw;
    max-width: 100px;
    max-height: 150px;
  }

  &.m-large {
    width: 20vw;
    height: 30vw;
  }
}
</style>
