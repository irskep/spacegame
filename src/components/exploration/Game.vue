<template>
  <div class="Game">
    <DebugToolbar />
    <div class="Game_Inner">
      <PanContainer className="Map" :center="panContainerCenter">
        <Starmap />
      </PanContainer>
      <PanelGroup className="m-hud-top">
        <Panel v-if="selectedStarID">
          <StarDetails :starID="selectedStarID" />
        </Panel>
      </PanelGroup>
    </div>
  </div>
</template>

<script>
import DebugToolbar from "@/components/exploration/DebugToolbar.vue";
import Starmap from "@/components/exploration/Starmap.vue";
import StarDetails from "@/components/exploration/StarDetails.vue";
import PanContainer from "@/components/exploration/PanContainer.vue";
import Panel from "@/components/ui/Panel.vue";
import PanelGroup from "@/components/ui/PanelGroup.vue";

export default {
  name: "Game",
  components: {
    StarDetails,
    DebugToolbar,
    Starmap,
    PanContainer,
    Panel,
    PanelGroup,
  },
  mounted: function () {
    this.$store.dispatch("galaxy/beginTick");
  },
  computed: {
    hoveredStarID: function () {
      return this.$store.state.ui.hoveredStarID;
    },
    selectedStarID: function () {
      return this.$store.state.ui.selectedStarID;
    },
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

<style lang="css">
.UI h6 {
  margin: 0;
}

.UI p:last-child {
  margin-bottom: 0;
}

.Game {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
}
.Game_Inner {
  position: relative;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-grow: 100;
  flex-shrink: 0;
}

.ActiveStar {
  flex-grow: 1;
}

.Starmap {
  flex-shrink: 0;
  flex-grow: 0;
}

.Map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: black;
}

.m-hud-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
