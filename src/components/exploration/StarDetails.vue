<template>
  <div class="StarDetails" v-if="starID">
    <h6>{{ info.name }}</h6>
    <p v-for="planet in planets" :key="planet.name" :class="planet.cssClass">
      {{ planet.name }}: {{ planet.planetType }}
    </p>
  </div>
</template>

<script lang="ts">
import { GalaxyState, StarMetadata } from "@/store/types";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters } = createNamespacedHelpers("galaxy");

interface PlanetRollup {
  name: string;
  planetType: string;
  cssClass: Record<string, boolean>;
}

export default {
  name: "StarDetails",
  components: {},
  props: {
    starID: String,
  },
  computed: {
    ...mapState(["starInfo", "planetInfo"]),
    ...mapGetters(["galaxy"]),
    state: function (): GalaxyState {
      return this.$store.state.galaxy as GalaxyState;
    },
    info: function (): StarMetadata {
      return this.starInfo[this.starID];
    },
    planets: function (): PlanetRollup[] {
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

      return this.info.planetIDs
        .map((pid) => this.state.planetInfo[pid])
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
    },
  },
};
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
