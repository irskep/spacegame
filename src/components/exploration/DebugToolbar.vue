<template>
  <div class="DebugToolbar">
    <button v-on:click="newSeed">New seed</button>
    <button v-on:click="resetState">Reset state</button>
  </div>
</template>

<script>
export default {
  name: "DebugToolbar",
  methods: {
    newSeed: function () {
      this.$store.commit("galaxy/newRandomSeed");
    },
    resetState: function () {
      delete localStorage.vuex;
      window.location.reload(false);
    },
  },
};
</script>

<style lang="scss">
.DebugToolbar {
  background-color: black;
  padding: 0 5px 5px 5px;
}
</style>
