import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type Modal = { type: "systemView"; starID: string; starName: string };

export const useModalStore = defineStore("modal", () => {
  const stack = ref<Modal[]>([]);

  const current = computed(() =>
    stack.value.length > 0 ? stack.value[stack.value.length - 1] : null,
  );

  function push(modal: Modal) {
    stack.value.push(modal);
  }

  function pop() {
    stack.value.pop();
  }

  function clear() {
    stack.value = [];
  }

  return { stack, current, push, pop, clear };
});
