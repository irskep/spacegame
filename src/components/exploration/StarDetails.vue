<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info.name }}</h6>
    <p>{{ govt.name }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { GalaxyState } from "@/store/types";
import { Govt } from "@/game/exploration/gen/StarGovtSystem";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import {
  StarMetadata,
  StarMetadataMap,
} from "@/game/exploration/gen/StarMetadataSystem";

const x = namespace("galaxy");

@Component
export default class StarDetails extends Vue {
  @Prop() starID!: string;
  @x.State govtInfo!: GovtMap;
  @x.State starInfo!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;

  get state(): GalaxyState {
    return this.$store.state as GalaxyState;
  }

  get info(): StarMetadata | null {
    if (!this.starID) return null;
    return this.starInfo[this.starID];
  }

  get govt(): Govt | null {
    if (!this.starID) return null;
    return this.govtInfo[this.starID];
  }
}
</script>

<style lang="css" scoped></style>
