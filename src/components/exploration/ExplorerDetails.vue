<template>
  <div class="ExplorerDetails" v-if="explorer">
    <h6>{{ explorer.name }}</h6>
    <img
      class="Spaceship m-large"
      :src="`/spaceships/${explorer.ship.image}`"
    />
    <p v-if="explorer.state === 'scanning'">Scanning {{ star.name }}</p>
    <ProgressBar
      v-if="explorer.state === 'scanning'"
      color="lightgreen"
      :progress="explorer.scanProgress"
    />
    <p v-if="explorer.state === 'traveling' && destStar">
      {{ star.name }} &rarr; {{ destStar.name }}
    </p>
    <ProgressBar
      v-if="explorer.state === 'traveling'"
      color="lightblue"
      :progress="explorer.travelProgress"
    />
    <p v-for="crew in explorer.crew" :key="crew.id">
      {{ crew.role }}: {{ crew.name }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import ProgressBar from "@/components/ui/ProgressBar.vue";
import { Explorer, GalaxyState } from "@/store/types";
import { Govt } from "@/game/exploration/gen/StarGovtSystem";
import { GovtMap } from "@/game/exploration/gen/StarGovtSystem";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import {
  StarMetadata,
  StarMetadataMap,
} from "@/game/exploration/gen/StarMetadataSystem";

const x = namespace("galaxy");

@Component({ components: { ProgressBar } })
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

<style lang="css" scoped>
img.Spaceship.m-large {
  height: 64px;
  width: auto;
}
</style>
