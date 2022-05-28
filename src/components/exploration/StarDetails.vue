<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info.name }}</h6>
    <p v-for="planet in planets" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
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
  planetType: string;
  cssClass: Record<string, boolean>;
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
    if (!this.info?.explored) return [];
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
      const hab = !isHot && !isCold && !isTidallyLocked;
      return {
        name: ordinals[i],
        planetType: planet.planetType,
        hab,
        isTidallyLocked,
        cssClass: {
          Planet: true,
          [`m-${planet.planetType}`]: true,
          "m-habitable": hab,
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
