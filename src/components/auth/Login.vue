<template>
  <div class="login card mx-auto">
    <div class="card-body">
      <form @submit.prevent="login">
        <h2 class="text-center text-danger">Login</h2>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" class="form-control" v-model="email">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" class="form-control" v-model="password">
        </div>
        <p v-if="feedback" class="text-danger text-center">{{feedback}}</p>
        <div class="text-center">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            this.$router.push({ name: "Home" });
          })
          .catch(error => {
            this.feedback = error.message;
            this.email = null;
            this.password = null;
          });
        this.feedback = null;
      } else {
        this.feedback = "Please fill in all fields";
      }
    }
  }
};
</script>

<style>
.card {
  width: 400px;
  margin-top: 10%;
}
</style>
