<template>
  <div class="Game">
    <DebugToolbar />
    <div class="Game_Inner">
      <ActiveStar />
      <Starmap />
    </div>
  </div>
</template>

<script>
import DebugToolbar from "@/components/DebugToolbar.vue";
import Starmap from "@/components/Starmap.vue";
import ActiveStar from "@/components/ActiveStar.vue";

export default {
  name: "Game",
  components: {
    ActiveStar,
    DebugToolbar,
    Starmap,
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
</style>
