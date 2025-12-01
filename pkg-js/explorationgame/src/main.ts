import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";

console.log("main.ts: Creating pinia");
const pinia = createPinia();
console.log("main.ts: Adding persistence plugin");
pinia.use(piniaPluginPersistedstate);
console.log("main.ts: Mounting app");

createApp(App).use(pinia).mount("#app");
console.log("main.ts: App mounted");
