<template>
  <div class="home container-fluid">
    <div class="row">
      <div class="col-1 bg-danger">
        <i @click="logout" class="fas fa-sign-out-alt"></i>
      </div>
      <div class="col-2 bg-light">
        <div
          class="d-flex mt-1 justify-content-between align-items-center border-bottom border-dark pb-2"
        >
          <i class="fas fa-user"></i>
          <h4 v-if="user" class="mb-0 b">{{user.displayName}}</h4>
        </div>
        <div class="d-flex flex-column justify-content-center mt-2">
          <h3 class="text-center text-danger">My Polls</h3>
          <a class="btn btn-dark text-light" data-toggle="modal" data-target="#AddModal">Add Polls</a>
        </div>
      </div>
      <div class="col-9">
        <div class="card-columns">
          <div v-for="poll in polls" :key="poll.id" class="card m-3">
            <h3 class="card-header text-center bg-danger text-light">
              {{poll.title}}
              <i class="fas fa-trash" @click="deletePoll(poll.id)"></i>
            </h3>
            <div class="card-body">
              <div class="card-text">qwe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="AddModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-danger">Create a new poll</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent>
              <div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" v-model="title">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-dismiss="modal">Cancel</button>
            <button
              @click="addPoll"
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              v-bind:disabled="!title"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
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
      title: null,
      polls: []
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
    },
    addPoll() {
      if (this.title) {
        db.collection("polls")
          .add({
            title: this.title,
            user_id: this.user.uid
          })
          .then(ref => {
            this.polls.push({
              title: this.title,
              user_id: this.user.uid,
              id: ref.id
            });
          })
          .catch(error => {
            console.log(error.message);
          });
      }
    },
    deletePoll(id) {
      db.collection("polls")
        .doc(id)
        .delete()
        .then(() => {
          this.polls = this.polls.filter(poll => {
            return poll.id != id;
          });
        });
    }
  },
  created() {
    let searchUserId = null;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        searchUserId = user.uid;

        db.collection("polls")
          .where("user_id", "==", searchUserId)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let poll = doc.data();
              poll.id = doc.id;
              this.polls.push(poll);
            });
            // console.log(snapshot);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.user = null;
      }
    });

    // ///!!!!!!!!!!!!!
    // let curUser = firebase.auth().currentUser;
    // db.collection("users")
    //   .doc(curUser.uid)
    //   .get()
    //   .then(user => {
    //     this.user = user.data();
    //     this.userDate = this.user.date.toDate();
    //     // console.log(this.userDate.toDate());
    //   });
  }
};
</script>

<style>
.row {
  min-height: 100vh;
}
.col-1 {
  font-size: 1em;
  max-width: 5%;
}
.fa-sign-out-alt {
  font-size: 2em;
  color: #f8f9fa;
  position: absolute;
  bottom: 1.5vh;
  left: 1.5vw;
  cursor: pointer;
}
.fa-sign-out-alt:hover {
  color: #343a40;
}
.fa-trash {
  color: #343a40;
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 0.8em;
}
.card-columns .card {
  box-shadow: 0 3px 10px 3px rgba(255, 255, 255, 0.3);
}
.card-columns .card h3 {
  position: relative;
}
</style>
