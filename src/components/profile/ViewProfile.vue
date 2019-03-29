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
          <h4 v-if="profileName" class="mb-0 b">{{profileName}}</h4>
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
              <div class="card-text">{{poll.text}}</div>
            </div>
            <div class="card-footer">
              <i
                @click="editPoll(poll.id)"
                class="fas fa-edit"
                data-toggle="modal"
                data-target="#AddModal"
              ></i>
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
            <h4 class="modal-title text-danger">{{isEdit ? "Update the":"Create a new"}} poll</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="resetIsEdit"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent>
              <div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" v-model="title">
              </div>
              <div class="form-group">
                <label for="text">Text</label>
                <textarea class="form-control" v-model="text"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              @click="resetIsEdit"
              type="button"
              class="btn btn-dark"
              data-dismiss="modal"
            >Cancel</button>
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
      text: null,
      polls: [],
      isEdit: false,
      updateId: null,
      profileName: null
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
      if (this.title && this.text) {
        if (!this.isEdit) {
          db.collection("polls")
            .add({
              title: this.title,
              user_id: this.user.uid,
              text: this.text
            })
            .then(ref => {
              this.polls.push({
                title: this.title,
                user_id: this.user.uid,
                id: ref.id,
                text: this.text
              });
              //Edit
              this.title = null;
              this.text = null;
            })
            .catch(error => {
              console.log(error.message);
            });
        } else {
          this.isEdit = false;
          db.collection("polls")
            .doc(this.updateId)
            .update({
              title: this.title,
              text: this.text
            })
            .then(() => {
              let updatedPoll = this.polls.find(poll => {
                return poll.id == this.updateId;
              });
              updatedPoll.title = this.title;
              updatedPoll.text = this.text;
              this.title = null;
              this.title = null;
            })
            .catch(error => {
              console.log(error);
            });
        }
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
    },
    editPoll(id) {
      this.updateId = id;
      let ref = db.collection("polls").doc(this.updateId);
      ref.get().then(doc => {
        this.title = doc.data().title;
        this.text = doc.data().text;
      });
      this.isEdit = true;
      //DOM !!!!!!!!!!!!!
    },
    resetIsEdit() {
      this.isEdit = false;
      this.text = null;
      this.title = null;
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
