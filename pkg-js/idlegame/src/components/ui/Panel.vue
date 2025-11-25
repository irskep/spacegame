<template>
  <div class="Panel UI"><slot /></div>
</template>

<script setup lang="ts">
// Simple slot wrapper component
</script>

<style>
.Panel {
  max-width: 350px;
  background-color: black;
  border: 1px solid #666;
  padding: 0.5rem;
  color: white;
  z-index: 1;
  width: auto;
  flex-grow: 0;
}
</style>
