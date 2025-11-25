<template>
  <div :class="computedClassName"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  className?: string;
}>();

const computedClassName = computed(() => `PanelGroup ${props.className || ""}`);
</script>

<style>
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
