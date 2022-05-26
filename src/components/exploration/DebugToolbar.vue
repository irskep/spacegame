<template>
  <div class="DebugToolbar">
    <button v-on:click="newSeed">New seed</button>
    <button v-on:click="resetState">Reset state</button>
    <button v-on:click="pause">Pause</button>
    <button v-on:click="resume">Resume</button>
  </div>
</template>

<script>
export default {
  name: "DebugToolbar",
  methods: {
    newSeed: function () {
      this.$store.commit("galaxy/newRandomSeed");
      window.location.reload(false);
    },
    resetState: function () {
      this.$store.dispatch("galaxy/stopTick");
      delete localStorage.vuex;
      window.location.reload(false);
    },
    pause: function () {
      this.$store.dispatch("galaxy/stopTick");
    },
    resume: function () {
      this.$store.dispatch("galaxy/beginTick");
    },
  },
};
</script>

<style lang="css">
.DebugToolbar {
  background-color: black;
  padding: 0 5px 5px 5px;
}
</style>
