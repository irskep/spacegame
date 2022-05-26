<template>
  <div class="ExplorerList">
    <p
      class="ExplorerList_Item"
      v-for="explorer of Object.values(explorers)"
      :key="explorer.id"
      v-on:click="selectExplorer(explorer.id)"
    >
      <strong>{{ explorer.name }}:</strong> {{ explorer.state }}
      <InlineProgressBar :progress="getExplorerProgress(explorer)" />
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import InlineProgressBar from "@/components/ui/InlineProgressBar.vue";
import { Explorer, GalaxyState } from "@/store/types";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { StarMetadataMap } from "@/game/exploration/gen/StarMetadataSystem";

const x = namespace("galaxy");

@Component({ components: { InlineProgressBar } })
export default class ExplorerDetails extends Vue {
  @Prop() explorerID!: string;
  @x.State explorers!: Record<string, Explorer>;
  @x.State govtInfo!: GovtMap;
  @x.State starInfo!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;

  get state(): GalaxyState {
    return this.$store.state as GalaxyState;
  }

  getExplorerProgress(e: Explorer): number {
    if (e.scanProgress > 0) return e.scanProgress;
    if (e.travelProgress > 0) return e.travelProgress;
    return 0;
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
