<template>
  <div class="home">
    <Starmap seed="1234" />
  </div>
</template>

<script>
// @ is an alias to /src
import Starmap from "@/components/Starmap.vue";

export default {
  name: "Home",
  components: {
    Starmap,
  },
};
</script>
