<template>
  <div
    class="PanContainer"
    :class="[className]"
    ref="container"
    @mousedown="onMousedown"
    @mouseup="onMouseup"
    @mouseleave="onMouseup"
    @mousemove="onMousemove"
    @wheel="onScroll"
  >
    <div class="PanContainer_Inner" :style="{ transform }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  center: { x: number; y: number };
  contentSize: { x: number; y: number };
  className?: string;
}>();

const container = ref<HTMLElement | null>(null);
const containerSize = ref({ width: 1, height: 1 });
const offset = ref({ x: 0, y: 0 });
const offsetStart = ref({ x: 0, y: 0 });
const mouseStart = ref({ x: 0, y: 0 });
const isMouseDown = ref(false);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (container.value) {
    const rect = container.value.getBoundingClientRect();
    containerSize.value = { width: rect.width, height: rect.height };
    resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      containerSize.value = { width, height };
    });
    resizeObserver.observe(container.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

// Scale factor: how much the content is scaled to fit the container
const scale = computed(() => {
  const scaleX = containerSize.value.width / props.contentSize.x;
  const scaleY = containerSize.value.height / props.contentSize.y;
  return Math.min(scaleX, scaleY); // "meet" behavior
});

const transform = computed(() => {
  const s = scale.value;
  const x = -props.center.x * s + offset.value.x;
  const y = -props.center.y * s + offset.value.y;
  return `translate(${x}px, ${y}px)`;
});

function onMousedown(e: MouseEvent) {
  isMouseDown.value = true;
  mouseStart.value = { x: e.clientX, y: e.clientY };
  offsetStart.value = offset.value;
}

function onMouseup() {
  isMouseDown.value = false;
}

function onMousemove(e: MouseEvent) {
  if (!isMouseDown.value) return;
  offset.value = {
    x: offsetStart.value.x + e.clientX - mouseStart.value.x,
    y: offsetStart.value.y + e.clientY - mouseStart.value.y,
  };
}

function onScroll(e: WheelEvent) {
  e.preventDefault();
  offset.value = {
    x: offset.value.x - e.deltaX,
    y: offset.value.y - e.deltaY,
  };
}

watch(
  () => props.center,
  () => {
    offset.value = { x: 0, y: 0 };
    offsetStart.value = { x: 0, y: 0 };
  },
);
</script>

<style>
.PanContainer {
  position: relative;
  overflow: hidden;
}

.PanContainer_Inner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
}
</style>
