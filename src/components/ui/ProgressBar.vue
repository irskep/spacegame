<template>
  <div class="ProgressBar">
    <div class="ProgressBar_Inner" :style="{ width: width }"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Panel extends Vue {
  @Prop() progress!: number;

  get width(): string {
    return `${(this.progress || 0) * 100}%`;
  }
}
</script>

<style lang="css">
.ProgressBar {
  position: relative;
  width: 100%;
  height: 1rem;
}

.ProgressBar_Inner {
  background-color: lightgreen;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
