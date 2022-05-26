<template>
  <div class="ExplorerDetails" v-if="explorerID">
    <h6>{{ explorer.name }}</h6>
    <p v-if="!isTraveling">{{ star.name }}</p>
    <p v-if="isTraveling">Between {{ star.name }} and {{ destStar.name }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Explorer, GalaxyState } from "@/store/types";
import { Govt } from "@/game/exploration/gen/StarGovtSystem";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import {
  StarMetadata,
  StarMetadataMap,
} from "@/game/exploration/gen/StarMetadataSystem";

const x = namespace("galaxy");

@Component
export default class ExplorerDetails extends Vue {
  @Prop() explorerID!: string;
  @x.State explorers!: Record<string, Explorer>;
  @x.State govtInfo!: GovtMap;
  @x.State starInfo!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;

  get state(): GalaxyState {
    return this.$store.state as GalaxyState;
  }

  get explorer(): Explorer {
    return this.explorers[this.explorerID];
  }

  get isTraveling(): boolean {
    return !!this.explorer.destinationStarID;
  }

  get star(): StarMetadata | null {
    return this.starInfo[this.explorer.starID];
  }

  get destStar(): StarMetadata | null {
    if (!this.explorer.destinationStarID) return null;
    return this.starInfo[this.explorer.destinationStarID];
  }

  get govt(): Govt | null {
    return this.govtInfo[this.explorer.starID];
  }
}
</script>

<style lang="css" scoped></style>
