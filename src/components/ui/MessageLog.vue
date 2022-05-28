<template>
  <div class="MessageLog">
    <h6>Message Log</h6>
    <p v-for="m in indexedMessages" :key="m.index">{{ m.text }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const g = namespace("galaxy");

@Component
export default class MessageLog extends Vue {
  @g.State messages!: string[];

  get indexedMessages(): { index: number; text: string }[] {
    return this.messages.slice(0, 10).map((text, index) => ({ index, text }));
  }
}
</script>

<style lang="css" scoped></style>
