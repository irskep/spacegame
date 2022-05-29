<template>
  <div class="ExplorerDetails" v-if="explorer">
    <h6>{{ explorer.name }}</h6>
    <img
      class="Spaceship m-large"
      :src="`/spaceships/${explorer.ship.image}`"
    />
    <p
      v-if="
        explorer.state === 'scanning' &&
        explorer.scannable &&
        explorer.scannable.kind === 'planet'
      "
    >
      Scanning planet {{ explorer.scannable.text }}
    </p>
    <p
      v-if="
        explorer.state === 'scanning' &&
        explorer.scannable &&
        explorer.scannable.kind === 'star'
      "
    >
      Scanning neighboring star {{ explorer.scannable.text }}
    </p>
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
import {
  Explorer,
  GalaxyState,
  StarMetadata,
  StarMetadataMap,
} from "@/store/types";
import { Galaxy } from "@/game/exploration/types/Galaxy";

const x = namespace("galaxy");

@Component({ components: { ProgressBar } })
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

  get explorer(): Explorer {
    // hack: watch animationHandle
    this.animationHandle;
    this.timerHandle;
    return this.explorers[this.explorerID];
  }

  get star(): StarMetadata | null {
    return this.starInfo[this.explorer.starID];
  }

  get destStar(): StarMetadata | null {
    if (!this.explorer.destinationStarID) return null;
    return this.starInfo[this.explorer.destinationStarID];
  }
}
</script>

<style lang="css" scoped>
img.Spaceship.m-large {
  height: 64px;
  width: auto;
}
</style>
