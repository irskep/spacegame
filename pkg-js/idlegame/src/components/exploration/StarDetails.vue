<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info.name }}</h6>
    <p v-for="planet in planets" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GalaxyState, PlanetInfo, StarMetadata } from "@/store/types";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters } = createNamespacedHelpers("galaxy");

interface PlanetRollup {
  name: string;
  planetType: string;
  cssClass: Record<string, boolean>;
}

export default Vue.extend({
  name: "StarDetails",
  components: {},
  props: {
    starID: String,
  },
  computed: {
    ...mapState(["starInfo", "planetInfo"]),
    ...mapGetters(["galaxy"]),
    state(): GalaxyState {
      return this.$store.state.galaxy as GalaxyState;
    },
    info(): StarMetadata {
      return (this as any).starInfo[this.starID];
    },
    planets(): PlanetRollup[] {
      const info = this.info;
      if (!info || !info.explored) return [];
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

      return info.planetIDs
        .map((pid: string) => this.state.planetInfo[pid])
        .filter((p: PlanetInfo) => p.known)
        .map((p: PlanetInfo) => {
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
    },
  },
});
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
