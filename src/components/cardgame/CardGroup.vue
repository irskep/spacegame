<template>
  <div class="CardGroup" :class="[extraClass]">
    <div class="CardGroup_Row">
      <img class="Portrait" :src="imgSrc" />
    </div>
    <div class="CardGroup_Cards">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardGroup",
  props: {
    extraClass: {
      type: String,
      default: "",
    },
    imgSrc: {
      type: String,
      default: "",
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.CardGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
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
    left: 0;
    right: 0;
    bottom: 30vw;
    pointer-events: none;

    & > * {
      pointer-events: auto;
    }

    @media (min-width: 940px) {
      bottom: 1vw;
    }
  }
}

.CardGroup_Cards {
  display: flex;

  & > * {
    margin-right: -1vw;

    &:nth-child(1) {
      margin-top: 0;
    }

    &:nth-child(2) {
      margin-top: 1vw;
    }

    &:nth-child(3) {
      margin-top: 2vw;
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      z-index: 1;
    }
  }
}

.Portrait {
  width: 15vw;
}
</style>
