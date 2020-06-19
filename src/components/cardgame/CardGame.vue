<template>
  <div class="CardGame m-fixed">
    <div class="ViewscreenContainer">
      <Viewscreen />
    </div>

    <div class="CrewLabel">Crew:</div>

    <CardGroup
      extraClass="m-bottom-left"
      imgSrc="/portraits/Mothership Chars 01.jpg"
    >
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup
      extraClass="m-bottom-center"
      imgSrc="/portraits/Mothership Chars 04.jpg"
    >
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup
      extraClass="m-bottom-right"
      imgSrc="/portraits/Mothership Chars 02.jpg"
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

export default {
  name: "CardGame",
  components: { Card, CardGroup, Viewscreen },
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

.CrewLabel {
  font-size: 3rem;
  position: absolute;
  top: 50%;
  width: 200px;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
</style>
