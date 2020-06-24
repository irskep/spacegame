<template>
  <div class="CardGame m-fixed">
    <div class="ViewscreenContainer">
      <Viewscreen />
    </div>

    <CardGroup
      extraClass="m-bottom-left"
      :crew="crew[0]"
      :imgSrc="`/portraits/${crew[0].portraitID}`"
    >
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup
      extraClass="m-bottom-center"
      :crew="crew[2]"
      :imgSrc="`/portraits/${crew[2].portraitID}`"
    >
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup
      extraClass="m-bottom-right"
      :crew="crew[1]"
      :imgSrc="`/portraits/${crew[1].portraitID}`"
    >
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>
  </div>
</template>

<script>
import Card from "@/components/cardgame/Card.vue";
import CardGroup from "@/components/cardgame/CardGroup.vue";
// import DeckRow from "@/components/cardgame/DeckRow.vue";
import Viewscreen from "@/components/cardgame/Viewscreen.vue";

import { CREW_MEMBERS } from "@/game/cardgame/CrewMember";

export default {
  name: "CardGame",
  components: { Card, CardGroup, Viewscreen },
  beforeMount: function () {
    this.$store.commit("cardgame/enter", {
      shipID: "normie",
      crewMembers: ["Alex", "Taylor", "Skylar"],
    });
  },
  computed: {
    crew: function () {
      return this.$store.state.cardgame.crew?.map((c) =>
        CREW_MEMBERS.get(c.crewID)
      );
    },
  },
};
</script>

<style lang="scss">
.CardGame {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &.m-fixed {
    position: fixed;
  }
}

.ViewscreenContainer {
  width: 100%;
  height: 30vw;
  position: absolute;
  top: 10vw;

  display: flex;
  justify-content: center;

  & > * {
    width: 70vw;
    height: 100%;
  }
}
</style>
