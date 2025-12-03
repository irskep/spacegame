<template>
  <div class="TechnologiesView">
    <h2>Technologies</h2>
    <div class="TechList">
      <div
        v-for="tech in allTechnologies"
        :key="tech.id"
        class="TechItem"
        :class="{ 'm-unlocked': techStore.isUnlocked(tech.id) }"
      >
        <div class="TechItem_Name">{{ tech.name }}</div>
        <div class="TechItem_Description">{{ tech.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTechStore } from "@/stores/techStore";
import { allTechnologies } from "@/technologies";

const techStore = useTechStore();
</script>

<style scoped>
.TechnologiesView {
  padding: 2rem;
  padding-top: 5rem;
  color: var(--color-text);
}

.TechnologiesView h2 {
  margin: 0 0 1rem 0;
}

.TechList {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.TechItem {
  background: var(--color-bg-button);
  border: 1px solid var(--color-border-light);
  padding: 0.5rem 1rem;
  opacity: 0.5;
}

.TechItem.m-unlocked {
  background: var(--color-bg-button-selected);
  opacity: 1;
}

.TechItem_Name {
  font-weight: bold;
}

.TechItem_Description {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
