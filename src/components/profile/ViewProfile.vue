<template>
  <div class="home container-fluid">
    <div class="row">
      <div class="col-1 bg-danger">
        <i @click="logout" class="fas fa-sign-out-alt"></i>
      </div>
      <div class="col-2 bg-light">
        <div class="d-flex mt-1 align-items-center border-bottom border-dark pb-2">
          <i class="fas fa-user"></i>
          <h5 v-if="profileName" class="mb-0 ml-auto">{{profileName}}</h5>
        </div>
        <div class="d-flex flex-column justify-content-center mt-2">
          <h3 class="text-center text-danger">My Polls</h3>
          <router-link :to="{name:'AddPoll'}" class="btn btn-dark text-light">Add Polls</router-link>
        </div>
        <div class="d-flex flex-column justify-content-center border-top border-dark mt-4">
          <h4 class="text-center text-dark mt-2">Polls</h4>
          <a
            class="btn btn-danger text-light"
            data-toggle="modal"
            data-target="#FindModal"
          >Find other polls</a>
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
              <div class="cart-title">Number:</div>
              <div class="card-text">{{poll.id}}</div>
            </div>
            <div class="card-footer">
              <i @click="editPoll(poll.id)" class="fas fa-edit"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Find Modal -->
    <div class="modal fade" id="FindModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-danger">Find another poll</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent>
              <div class="form-group">
                <label for="findid">Enter the poll number</label>
                <input type="search" class="form-control" v-model="findid">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-dismiss="modal">Cancel</button>
            <button
              @click="findPoll(findid)"
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              v-bind:disabled="!findid"
            >Search</button>
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
      polls: [],
      profileName: null,
      findid: null
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
    deletePoll(id) {
      db.collection("polls")
        .doc(id)
        .delete()
        .then(() => {
          this.polls = this.polls.filter(poll => {
            return poll.id != id;
          });
        });
    },
    editPoll(id) {
      this.$router.push({ name: "EditPoll", params: { poll_id: id } });
    },
    findPoll(id) {
      this.$router.push({ name: "Poll", params: { poll_id: id } });
    }
  },
  created() {
    let searchUserId = null;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        searchUserId = user.uid;
        this.profileName = user.displayName;
        //цей блок необхідний для опрацювання відображення user name на /profile відразу
        //після реєстрації
        if (!this.profileName) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
              if (doc.exists) {
                this.profileName = doc.data().name;
              }
            });
        }
        db.collection("polls")
          .where("user_id", "==", searchUserId)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let poll = doc.data();
              poll.id = doc.id;
              this.polls.push(poll);
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.user = null;
      }
    });
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
.fa-sign-out-alt:hover,
.fa-edit:hover {
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
.fa-trash:hover {
  color: #f8f9fa;
}
.fa-edit {
  cursor: pointer;
  color: #dc3545;
}
.card-columns .card {
  box-shadow: 0 3px 10px 3px rgba(255, 255, 255, 0.3);
}
.card-columns .card h3 {
  position: relative;
}
</style>
