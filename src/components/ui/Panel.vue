<template>
  <div class="Panel UI"><slot></slot></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Panel extends Vue {}
</script>

<style lang="css">
.Panel {
  background-color: black;
  border: 1px solid #666;
  padding: 0.5rem;
  color: white;
  z-index: 1;
  width: auto;
  flex-grow: 0;
}
</style>
