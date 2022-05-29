<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info.name }}</h6>
    <p v-for="planet in planets" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import {
  GalaxyState,
  PlanetInfo,
  StarMetadata,
  StarMetadataMap,
} from "@/store/types";
import { Galaxy } from "@/game/exploration/types/Galaxy";

const x = namespace("galaxy");

interface PlanetRollup {
  name: string;
  planetType: string;
  cssClass: Record<string, boolean>;
}

@Component
export default class StarDetails extends Vue {
  @Prop() starID!: string;
  @x.State starInfo!: StarMetadataMap;
  @x.State planetInfo!: Record<string, PlanetInfo>;
  @x.Getter galaxy!: Galaxy;
  @x.Getter starSystemPlanets!: (sid: string) => PlanetInfo[];

  @Watch("galaxy.planetInfo", { deep: true })
  function() {
    /* noop */
  }

  get state(): GalaxyState {
    return this.$store.state.galaxy;
  }

  get info(): StarMetadata | null {
    if (!this.starID) return null;
    return this.starInfo[this.starID];
  }

  get planets(): PlanetRollup[] {
    this.planetInfo;
    this.info?.planetIDs;
    if (!this.info || !this.info?.explored) return [];
    const ordinals: string[] = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
      "Thirteenth",
      "Fourteenth",
      "Fifteenth",
      "Sixteenth",
      "Seventeenth",
      "Eighteenth",
      "Nineteenth",
      "Twentieth",
    ];

    return this.starSystemPlanets(this.starID)
      .filter((p) => p.known)
      .map((p) => {
        return {
          name: ordinals[p.index],
          planetType: p.type,
          hab: p.isTerranHabitable,
          isTidallyLocked: p.isTidallyLocked,
          cssClass: {
            Planet: true,
            [`m-${p.type}`]: true,
            "m-habitable": p.isTerranHabitable,
          },
        };
      });
  }
}
</script>

<style lang="css" scoped>
.Planet.m-Neptunian {
  color: teal;
}
.Planet.m-Terran {
  color: lightblue;
}
.Planet.m-Jovian {
  color: tan;
}
.Planet.m-Terran.m-habitable {
  color: lightgreen;
}
</style>
