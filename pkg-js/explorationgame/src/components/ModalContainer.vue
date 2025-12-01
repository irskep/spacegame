<template>
  <Teleport to="body">
    <div v-if="modalStore.current" class="ModalContainer">
      <div class="Modal_Backdrop" @click="modalStore.pop()" />
      <div class="Modal">
        <SystemViewModal
          v-if="modalStore.current.type === 'systemView'"
          :starID="modalStore.current.starID"
          :starName="modalStore.current.starName"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useModalStore } from "../stores/modalStore";
import SystemViewModal from "./SystemViewModal.vue";

const modalStore = useModalStore();

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && modalStore.current) {
    modalStore.pop();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.ModalContainer {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.Modal_Backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
}

.Modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(50vw, 66.67vh);
  aspect-ratio: 4 / 3;
  background: var(--color-bg-modal);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  z-index: 100;
  overflow: hidden;
}
</style>
