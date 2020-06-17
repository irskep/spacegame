<template>
  <div class="CardGroup" :class="[extraClass]"><slot></slot></div>
</template>

<script>
export default {
  name: "CardGroup",
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
.CardGroup {
  display: flex;
  // width: 20vw;
  // height: 30vw;
  // background-color: rgba(0, 0, 0, 0.1);

  &.m-bottom-left {
    position: absolute;
    left: 1vw;
    bottom: 1vw;
  }

  &.m-bottom-right {
    position: absolute;
    right: 1vw;
    bottom: 1vw;
  }

  &.m-bottom-center {
    position: absolute;
    left: 20vw;
    right: 20vw;
    bottom: 30vw;

    display: flex;
    justify-content: center;
  }

  & > * {
    margin-right: 1vw;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
