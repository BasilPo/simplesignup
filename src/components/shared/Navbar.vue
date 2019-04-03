<template>
  <nav class="navbar navbar-expand-sm bg-danger navbar-dark logout">
    <router-link :to="{name:'Home'}" class="navbar-brand">Logo</router-link>
    <ul class="navbar-nav ml-auto">
      <li v-if="!user" class="nav-item">
        <router-link :to="{name: 'Signup'}" class="nav-link text-light">Sign up</router-link>
      </li>
      <li v-if="!user" class="nav-item">
        <router-link :to="{name: 'Login'}" class="nav-link text-light">Sign in</router-link>
      </li>
      <li v-if="user" class="nav-item">
        <router-link
          :to="{name: 'ViewProfile'}"
          id="disp-name"
          class="nav-link text-light"
        >{{user.displayName}}</router-link>
      </li>
      <li v-if="user" class="nav-item">
        <a href="#" @click="logout" class="nav-link text-light">Sign out</a>
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
#disp-name:hover {
  background-color: #343a40;
  border-radius: 3px;
}
</style>


