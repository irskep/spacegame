<template>
  <div class="ActiveStar" v-if="star">
    <h1>{{ starMetadata.name }}</h1>
    <p>{{ starGovt.name }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { GalaxyState } from "@/store/types";
import { Govt } from "@/game/exploration/gen/StarGovtSystem";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import {
  StarMetadataMap,
  StarMetadata,
} from "@/game/exploration/gen/StarMetadataSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { Star } from "@/game/exploration/types/Star";

const x = namespace("galaxy");

@Component
export default class ActiveStar extends Vue {
  @x.Getter govtMap!: GovtMap;
  @x.Getter metadataMap!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;
  @x.Getter("playerStar") star!: Star;
  @x.Getter("playerStarGovt") starGovt!: Govt;
  @x.Getter("playerStarMetadata") starMetadata!: StarMetadata;

  get state(): GalaxyState {
    return this.$store.state as GalaxyState;
  }
}
</script>

<style lang="css" scoped></style>
