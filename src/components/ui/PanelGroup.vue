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
  padding-top: 0.5rem;
  pointer-events: none;
  justify-content: flex-start;
  align-items: flex-start;
}

.PanelGroup > * {
  margin-left: 0.5rem;
  pointer-events: auto;
}
</style>
