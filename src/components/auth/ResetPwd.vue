<template>
  <div class="reset card mx-auto">
    <div class="card-body">
      <h2 class="card-header text-center text-danger font-weight-bold">Reset your password</h2>
      <form @submit.prevent="resetPwd">
        <p
          class="text-center text-dark"
        >Enter your email address and we will send you a link to reset your password</p>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" class="form-control" v-model="email">
        </div>
        <p v-if="feedback" class="text-danger text-center">{{feedback}}</p>
        <div class="text-center">
          <button type="submit" class="btn btn-dark">Send password reset email</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "ResetPwd",
  data() {
    return {
      email: null,
      feedback: null
    };
  },
  methods: {
    resetPwd() {
      if (this.email) {
        firebase
          .auth()
          .sendPasswordResetEmail(this.email)
          .then(() => {
              
          })
          .catch(error => {
            console.log(error.message);
          });
        this.feedback = null;
      } else {
        this.feedback = "Please enter your email address";
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
