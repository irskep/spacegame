<template>
  <div class="DeckRow" :class="[extraClass]"><slot></slot></div>
</template>

<script>
export default {
  name: "DeckRow",
  props: {
    extraClass: {
      type: String,
      default: "",
    },
  },
  components: {},
};
</script>

<style lang="scss">
.DeckRow {
  width: 100%;
  height: 35vw;
  border-top: 1px solid black;
  padding: 2vw;

  display: flex;
  justify-content: space-around;

  &.m-bottom {
    position: absolute;
    bottom: 0;
  }
}
</style>
