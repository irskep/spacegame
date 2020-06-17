import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import CardGameView from "@/views/CardGameView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cardgame",
    name: "Card Game",
    component: CardGameView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
