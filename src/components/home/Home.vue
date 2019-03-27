<template>
  <div class="home container">
    <h2 class="text-center"></h2>
    <table class="table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Password</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-if="user">{{user.email}}</td>
          <td v-if="user">{{user.password}}</td>
          <td v-if="userDate">{{userDate}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
export default {
  name: "Home",
  data() {
    return {
      user: null,
      userDate: null
    };
  },
  created() { ///!!!!!!!!!!!!!  
    let curUser = firebase.auth().currentUser;
    db.collection("users")
      .doc(curUser.uid)
      .get()
      .then(user => {
        this.user = user.data();
        this.userDate = this.user.date.toDate();
        // console.log(this.userDate.toDate());
      });
  }
};
</script>

<style>
.home {
  position: relative;
  top: 100px;
}
</style>