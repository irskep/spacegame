<template>
  <div class="InlineProgressBar">
    <div
      class="InlineProgressBar_Inner"
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
