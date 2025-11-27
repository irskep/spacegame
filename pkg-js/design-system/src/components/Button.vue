<template>
  <button class="Button" :class="{ 'm-selected': selected }">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ selected?: boolean }>();
</script>

<style>
.Button {
  background: var(--color-bg-button);
  border: 1px solid var(--color-border-light);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.Button:hover {
  background: var(--color-bg-button-selected);
}

.Button.m-selected {
  background: var(--color-bg-button-selected);
}
</style>
