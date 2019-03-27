<template>
  <div class="signup card mx-auto">
    <div class="card-body">
      <form @submit.prevent="signup">
        <h2 class="text-center text-danger">Signup</h2>
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
          <button type="submit" class="btn btn-primary">Signup</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "Signup",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    signup() {
      if (this.email && this.password) {
        //встановлення reference до колекції
        let ref = db.collection("users");
        //необовязково перевіряти чи вже існує документ з даним юзером
        //auth бере роботу на себе - не буде двічі створено користувача
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            ref.doc(cred.user.uid).set({
              email: this.email,
              password: this.password,
              date: new Date()
            });
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          })
          .catch(error => {
            console.log(error);
            this.feedback = error.message;
          });
      } else {
        this.feedback = "Please fill in all fields";
      }
    }
  }
};
</script>

<style>
.card {
  max-width: 400px;
  margin-top: 10%;
}
</style>
