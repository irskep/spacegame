import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStateStore = defineStore("uiState", () => {
  const activeView = ref<"galaxy" | "system" | "technologies">("galaxy");

  return { activeView };
});
