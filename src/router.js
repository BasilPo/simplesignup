import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/home/Home.vue";
import Signup from "@/components/auth/Signup.vue";
import Login from "@/components/auth/Login.vue";
import ResetPwd from "@/components/auth/ResetPwd.vue";
import ViewProfile from "@/components/profile/ViewProfile.vue";
import firebase from "firebase";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        requiresAuth: false,
        requiresNavbar: true
      }
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
      meta: {
        requiresNavbar: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresNavbar: true
      }
    },
    {
      path: "/reset-pwd",
      name: "ResetPwd",
      component: ResetPwd,
      meta: {
        requiresNavbar: true
      }
    },
    {
      path: "/profile",
      name: "ViewProfile",
      component: ViewProfile,
      meta: {
        requiresAuth: true,
        requiresNavbar: false
      }
    }
  ]
});

//для певного виду route встановлюэться метадані (атрибути в .NET)
//аунтифікаціЇ - що обмежують дступ до даного роута
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = firebase.auth().currentUser;
    if (user) {
      next();
    } else {
      next({
        name: "Login"
      });
    }
  } else {
    next();
  }
});

export default router;
