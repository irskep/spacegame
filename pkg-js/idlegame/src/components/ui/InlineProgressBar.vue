<template>
  <div class="InlineProgressBar">
    <div
      class="InlineProgressBar_Inner"
      :style="{ width: width, backgroundColor: color || 'lightgreen' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class InlineProgressBar extends Vue {
  @Prop() progress!: number;
  @Prop() color!: string;

  get width(): string {
    return `${(this.progress || 0) * 100}%`;
  }
}
</script>

<style lang="css">
.InlineProgressBar {
  position: relative;
  display: inline-block;
  width: 10rem;
  height: 1rem;
}

.InlineProgressBar_Inner {
  background-color: lightgreen;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
