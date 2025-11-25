import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import { RootState } from "./types";
import { GalaxyModule } from "./GalaxyModule";
import { UIModule } from "./UIModule";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    galaxy: GalaxyModule,
    ui: UIModule,
  },
  plugins: [new VuexPersistence().plugin],
});
