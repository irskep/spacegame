<template>
  <div class="ProgressBar">
    <div
      class="ProgressBar_Inner"
      :style="{ width: width, backgroundColor: color || 'lightgreen' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ProgressBar extends Vue {
  @Prop() progress!: number;
  @Prop() color!: string;

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
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
