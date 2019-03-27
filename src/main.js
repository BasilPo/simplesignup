import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

Vue.config.productionTip = false;

//необхідно щоб firebase.auth швидше ініціалізувалася ніж
//створиться App. Для цього обгортаємо обєкт 'new Vue'
let app = null;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});
