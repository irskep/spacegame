<template>
  <div :class="_className"><slot></slot></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PanelGroup extends Vue {
  @Prop() className?: string;

  get _className(): string {
    return `PanelGroup ${this.className || ""}`;
  }
}
</script>

<style lang="css">
.PanelGroup {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  pointer-events: none;
  justify-content: flex-start;
  align-items: flex-start;
}

.PanelGroup > * {
  margin-bottom: 1rem;
  pointer-events: auto;
}

.PanelGroup.m-hud-left {
  position: absolute;
  top: 0;
  left: 1rem;
  bottom: 0;
}

.PanelGroup.m-hud-right {
  position: absolute;
  top: 0;
  right: 1rem;
  bottom: 0;
}
</style>
