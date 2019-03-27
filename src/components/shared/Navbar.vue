<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top logout">
    <router-link :to="{name:'Home'}" class="navbar-brand">Logo</router-link>
    <ul class="navbar-nav ml-auto">
      <li v-if="!user" class="nav-item">
        <router-link :to="{name: 'Signup'}" class="nav-link">Sign up</router-link>
      </li>
      <li v-if="!user" class="nav-item">
        <router-link :to="{name: 'Login'}" class="nav-link">Login</router-link>
      </li>
      <li v-if="user" class="nav-item">
        <a href="#" class="nav-link">{{user.email}}</a>
      </li>
      <li v-if="user" class="nav-item">
        <a href="#" @click="logout" class="nav-link">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Navbar",
  data() {
    return {
      user: null
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
  },
  //хук - перед тим як компонент відобразиться (rendering)
  //перевірка чи є аунтифікований user (залогінений)
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }
};
</script>

<style>
</style>


