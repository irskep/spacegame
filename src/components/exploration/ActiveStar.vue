<template>
  <div class="ActiveStar" v-if="star">
    <h1>{{ starMetadata.name }}</h1>
    <p>{{ starGovt.name }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { GameState } from "@/store";
import { Govt } from "@/game/gen/StarGovtSystem";
import { GovtMap } from "@/game/gen/StarGovtSystem";
import { StarMetadataMap, StarMetadata } from "@/game/gen/StarMetadataSystem";
import { Galaxy } from "@/game/types/Galaxy";
import { Star } from "@/game/types/Star";

const x = namespace("game");

@Component
export default class ActiveStar extends Vue {
  @x.Getter govtMap!: GovtMap;
  @x.Getter metadataMap!: StarMetadataMap;
  @x.Getter galaxy!: Galaxy;
  @x.Getter("playerStar") star!: Star;
  @x.Getter("playerStarGovt") starGovt!: Govt;
  @x.Getter("playerStarMetadata") starMetadata!: StarMetadata;

  get state(): GameState {
    return this.$store.state as GameState;
  }
}
</script>

<style lang="scss" scoped></style>
