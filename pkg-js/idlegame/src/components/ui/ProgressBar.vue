<template>
  <div class="ProgressBar">
    <div
      class="ProgressBar_Inner"
      :style="{ width: width, backgroundColor: color || 'lightgreen' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  progress?: number;
  color?: string;
}>();

const width = computed(() => `${(props.progress || 0) * 100}%`);
</script>

<style>
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
