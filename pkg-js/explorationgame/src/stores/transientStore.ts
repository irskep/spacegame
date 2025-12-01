import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransientStore = defineStore("transient", () => {
  const hoveredNodeID = ref<string | null>(null);

  return { hoveredNodeID };
});
