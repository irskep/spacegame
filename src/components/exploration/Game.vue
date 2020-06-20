<template>
  <div class="Game">
    <DebugToolbar />
    <div class="Game_Inner">
      <ActiveStar />
      <PanContainer className="Map" :center="panContainerCenter">
        <Starmap />
      </PanContainer>
    </div>
  </div>
</template>

<script>
import DebugToolbar from "@/components/exploration/DebugToolbar.vue";
import Starmap from "@/components/exploration/Starmap.vue";
import ActiveStar from "@/components/exploration/ActiveStar.vue";
import PanContainer from "@/components/exploration/PanContainer.vue";

export default {
  name: "Game",
  components: {
    ActiveStar,
    DebugToolbar,
    Starmap,
    PanContainer,
  },
  computed: {
    panContainerCenter: function () {
      const star = this.$store.getters["galaxy/playerStar"];
      if (star) {
        return star.point;
      } else {
        return { x: 400, y: 300 };
      }
    },
  },
};
</script>

<style lang="scss">
.Game_Inner {
  display: flex;
  flex-wrap: wrap;
}

.ActiveStar {
  flex-grow: 1;
}

.Starmap {
  flex-shrink: 0;
  flex-grow: 0;
}

.Map {
  width: 414px;
  height: 414px;
  background-color: black;
}
</style>
