<template>
  <div class="ExplorerList">
    <p
      class="ExplorerList_Item"
      v-for="explorer of Object.values(explorers)"
      :key="explorer.id"
      v-on:click="selectExplorer(explorer.id)"
    >
      <strong>{{ explorer.name }}:</strong> {{ explorer.state }}
      <InlineProgressBar
        :progress="getExplorerProgress(explorer)"
        :color="getExplorerColor(explorer)"
      />
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import InlineProgressBar from "@/components/ui/InlineProgressBar.vue";
import { Explorer, GalaxyState, StarMetadataMap } from "@/store/types";
import { Galaxy } from "@/game/exploration/types/Galaxy";

const x = namespace("galaxy");

@Component({ components: { InlineProgressBar } })
export default class ExplorerDetails extends Vue {
  @Prop() explorerID!: string;
  @x.State explorers!: Record<string, Explorer>;
  @x.State starInfo!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;

  @x.State animationHandle!: number;
  @x.State timerHandle!: number;

  get state(): GalaxyState {
    return this.$store.state as GalaxyState;
  }

  getExplorerProgress(e: Explorer): number {
    // hack: watch animationHandle
    this.animationHandle;
    this.timerHandle;

    switch (e.state) {
      case "traveling":
        return e.travelProgress;
      case "scanning":
        return e.scanProgress;
    }
  }

  getExplorerColor(e: Explorer): string {
    return {
      traveling: "lightblue",
      scanning: "lightgreen",
    }[e.state];
  }

  selectExplorer(eid: string) {
    this.$store.commit("ui/selectExplorer", eid);
  }
}
</script>

<style lang="css" scoped>
.ExplorerList_Item {
  cursor: pointer;
}

.ExplorerList_Item:hover {
  background-color: #444;
}
</style>
