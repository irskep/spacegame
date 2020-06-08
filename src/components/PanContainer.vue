<template>
  <div
    class="PanContainer"
    :class="[className]"
    ref="container"
    v-on:mousedown="mousedown"
    v-on:mouseup="mouseup"
    v-on:mouseleave="mouseup"
    v-on:mousemove="mousemove"
  >
    <div
      class="PanContainer_Inner"
      :style="{
        transform: transform,
      }"
    >
      <slot ref="child"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PanContainer",
  data: function () {
    return {
      offset: { x: 0, y: 0 },
      offsetStart: { x: 0, y: 0 },
      mouseStart: { x: 0, y: 0 },
      isMouseDown: false,
    };
  },
  props: ["center", "className"],
  mounted: function () {
    const containerSize = {
      x: this.$refs.container.clientWidth,
      y: this.$refs.container.clientHeight,
    };
    return;
  },
  computed: {
    transform: function () {
      const x = -this.$props.center.x + this.offset.x;
      const y = -this.$props.center.y + this.offset.y;
      return `translate(${x}px, ${y}px)`;
    },
  },
  methods: {
    mousedown: function (e) {
      this.isMouseDown = true;
      this.mouseStart = { x: e.clientX, y: e.clientY };
      this.offsetStart = this.offset;
    },
    mouseup: function () {
      this.isMouseDown = false;
    },
    mousemove: function (e) {
      if (!this.isMouseDown) return;
      this.offset = {
        x: this.offsetStart.x + e.clientX - this.mouseStart.x,
        y: this.offsetStart.y + e.clientY - this.mouseStart.y,
      };
    },
  },
  watch: {
    center: function () {
      this.offset = { x: 0, y: 0 };
      this.offsetStart = { x: 0, y: 0 };
      this.mouseDelta = { x: 0, y: 0 };
    },
  },
};
</script>

<style lang="scss">
.PanContainer {
  position: relative;
  overflow: hidden;
}

.PanContainer_Inner {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
