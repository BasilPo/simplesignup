<template>
  <div class="reset card mx-auto">
    <div class="card-body">
      <div class="card-header text-center text-danger font-weight-bold">Reset your password</div>
      <form @submit.prevent="resetPwd">
        <p
          class="text-center text-info"
        >Enter your email address and we will send you a link to reset your password</p>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" class="form-control" v-model="email">
        </div>
        <p v-if="feedback" class="text-danger text-center">{{feedback}}</p>
        <div class="text-center">
          <button type="submit" class="btn btn-primary">Send password reset email</button>
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
        // firebase
        //   .auth()
        //   .signInWithEmailAndPassword(this.email, this.password)
        //   .then(cred => {
        //     this.$router.push({ name: "Home" });
        //   })
        //   .catch(error => {
        //     this.feedback = error.message;
        //     this.email = null;
        //     this.password = null;
        //   });
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
