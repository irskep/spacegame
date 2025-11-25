<template>
  <div class="MessageLog">
    <h6>Message Log</h6>
    <p v-for="m in indexedMessages" :key="m.index">{{ m.text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  messages: string[];
  maxMessages?: number;
}>();

const indexedMessages = computed(() =>
  props.messages
    .slice(0, props.maxMessages ?? 10)
    .map((text, index) => ({ index, text })),
);
</script>

<style>
.MessageLog {
  text-align: right;
}
</style>
