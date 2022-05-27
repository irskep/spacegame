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
import { getStarSystem } from "@/store/GalaxyModule";
import { StarSystem } from "stellardream";

const x = namespace("galaxy");

interface PlanetInfo {
  name: string;
}

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

  get starSystem(): StarSystem {
    return getStarSystem(this.starID);
  }

  get planets(): PlanetInfo[] {
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

    const planets = getStarSystem(this.starID).planets;
    return planets.map((planet, i) => {
      const isCold = planet.distance > this.starSystem.habitableZoneMax;
      const isHot = planet.distance < this.starSystem.habitableZoneMin;
      const isTidallyLocked =
        !isCold && this.starSystem.stars[0].starType == "M";
      return {
        name: ordinals[i],
        hab: !isHot && !isCold,
        isTidallyLocked,
        planetType: planet.planetType,
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
</style>
