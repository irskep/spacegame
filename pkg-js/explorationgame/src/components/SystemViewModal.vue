<template>
  <div class="SystemViewModal">
    <h2 class="SystemViewModal_Title">{{ starName }}</h2>

    <div v-if="exploration === 'discovered'" class="SystemViewModal_Unexplored">
      Unexplored
    </div>

    <SystemViewSVG
      v-else
      :star="system.stars[0]"
      :planets="system.planets"
      :habitableZoneMin="system.habitableZoneMin"
      :habitableZoneMax="system.habitableZoneMax"
      :seed="starID"
    />
  </div>
</template>

<script setup lang="ts">
import { getStarSystem } from "@spacegame/galaxygen";
import { SystemViewSVG } from "@spacegame/galaxyrender";
import { computed } from "vue";
import { useExplorationStore } from "../stores/explorationStore";

const props = defineProps<{
  starID: string;
  starName: string;
}>();

const explorationStore = useExplorationStore();

const system = computed(() => getStarSystem(props.starID));
const exploration = computed(() =>
  explorationStore.getExploration(props.starID),
);
</script>

<style scoped>
.SystemViewModal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.SystemViewModal_Title {
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.SystemViewModal_Unexplored {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  font-size: 1.5rem;
  opacity: 0.5;
}
</style>
