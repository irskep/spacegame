<template>
  <div class="CardGame m-fixed">
    <!-- <DeckRow extraClass="m-bottom"> -->
    <CardGroup extraClass="m-bottom-left">
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup extraClass="m-bottom-right">
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>

    <CardGroup extraClass="m-bottom-center">
      <Card size="medium" />
      <Card size="medium" />
      <Card size="medium" />
    </CardGroup>
    <!-- </DeckRow> -->
  </div>
</template>

<script>
import Card from "@/components/cardgame/Card.vue";
import CardGroup from "@/components/cardgame/CardGroup.vue";
// import DeckRow from "@/components/cardgame/DeckRow.vue";

export default {
  name: "CardGame",
  components: { Card, CardGroup },
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
</style>
