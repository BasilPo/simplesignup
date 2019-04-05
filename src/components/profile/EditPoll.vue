<template>
  <div class="editpoll container-fluid">
    <div v-if="poll" class="card text-dark" id="add-poll">
      <div class="card-header">
        <span id="curindex" class="badge badge-danger badge-pill">current: {{curQuestionIndex+1}}</span>
        <span
          id="curindex"
          class="badge badge-dark badge-pill ml-1"
        >saved: {{poll.questions.length}}</span>
        <h3 class="text-center">Update the poll</h3>
      </div>
      <div class="card-body">
        <p class="text-danger text-center" v-if="feedback">{{feedback}}</p>
        <form @submit.prevent>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Title</span>
            </div>
            <input type="text" class="form-control" placeholder="Poll Header" v-model="poll.title">
          </div>
          <fieldset class="px-3 rounded">
            <legend class="rounded px-1 text-light">Edit a question</legend>
            <div class="form-group">
              <label>Title</label>
              <textarea class="form-control" name="question-title" v-model="curQuestion.title"></textarea>
            </div>
            <div class="form-group">
              <label>Id</label>
              <input type="text" name="question-id" class="form-control" v-model="curQuestion.id">
            </div>
            <p v-if="curQuestion.answers.length">Answers:</p>
            <div
              v-for="(answer, index) in curQuestion.answers"
              :key="index"
              class="form-control p-0 mb-2"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Id</span>
                </div>
                <input class="form-control" type="text" name="anser-id" v-model="answer.id">
                <div class="input-group-prepend">
                  <span class="input-group-text">Title</span>
                </div>
                <input class="form-control" type="text" name="answer-title" v-model="answer.title">
                <div class="input-group-append">
                  <button class="btn">
                    <i class="fas fa-minus-circle" @click="deleteAnswer(answer)"></i>
                  </button>
                </div>
              </div>
            </div>
            <label>Add answer choices</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Id</span>
              </div>
              <input class="form-control" type="text" name="anser-id" v-model="answerId">
              <div class="input-group-prepend">
                <span class="input-group-text">Title</span>
              </div>
              <input class="form-control" type="text" name="answer-title" v-model="answerTitle">
              <div class="input-group-append">
                <button class="btn">
                  <i class="fas fa-plus-circle" @click="addAnswer"></i>
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="card-footer d-flex">
        <button @click="cancel" type="button" class="btn btn-dark mr-1">Cancel</button>
        <button @click="editPoll" type="button" class="btn btn-danger mr-auto">Update Poll</button>
        <button
          @click="prevQuestion"
          type="button"
          class="btn btn-outline-danger mr-1"
          v-bind:disabled="!curQuestionIndex"
        >Previous Question</button>
        <button
          @click="nextQuestion"
          type="button"
          class="btn btn-outline-danger"
        >{{!isNewQuestion?"Next":"Save"}} Question</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
export default {
  name: "EditPoll",
  props: ["poll_id"],
  data() {
    return {
      poll: null,
      curQuestion: null,
      feedback: null,
      answerId: null,
      answerTitle: null,
      curQuestionIndex: 0,
      isNewQuestion: false
    };
  },
  methods: {
    cancel() {
      this.$router.push({ name: "ViewProfile" });
    },
    addAnswer() {
      if (this.answerTitle && this.answerId) {
        let objAnswer = {};
        objAnswer.title = this.answerTitle;
        objAnswer.id = this.answerId;
        this.curQuestion.answers.push(objAnswer);
        this.answerTitle = null;
        this.answerId = null;
      }
    },
    deleteAnswer(answer) {
      this.curQuestion.answers.splice(
        this.curQuestion.answers.indexOf(answer),
        1
      );
    },
    nextQuestion() {
      if (
        !this.curQuestion.id ||
        !this.curQuestion.title ||
        !this.curQuestion.answers.length
      ) {
        this.feedback = "You must fill in all the fields";
      } else {
        if (this.curQuestionIndex < this.poll.questions.length - 1) {
          this.curQuestionIndex++;
          this.curQuestion = this.poll.questions[this.curQuestionIndex];
        } else {
          if (!this.isNewQuestion) {
            let objQuestion = { id: null, title: null, answers: [] };
            this.curQuestion = objQuestion;
            this.isNewQuestion = true;
            this.curQuestionIndex++;
          } else {
            this.poll.questions.push(this.curQuestion);

            this.isNewQuestion = false;
          }
        }
        this.feedback = null;
      }
    },
    prevQuestion() {
      if (this.curQuestionIndex > 0) {
        this.curQuestionIndex--;
        this.curQuestion = this.poll.questions[this.curQuestionIndex];
        this.isNewQuestion = false;
        this.feedback = null;
      }
    },
    editPoll() {
      db.collection("polls")
        .doc(this.poll.id)
        .update({
          title: this.poll.title,
          user_id: this.poll.user_id,
          questions: this.poll.questions
        })
        .then(() => {
          this.$router.push({ name: "ViewProfile" });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let ref = db.collection("polls").doc(this.poll_id);
    ref
      .get()
      .then(doc => {
        this.poll = doc.data();
        this.poll.id = doc.id;
        this.curQuestion = this.poll.questions[this.curQuestionIndex];
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style>
#add-poll {
  max-width: 80%;
  width: 80%;
  margin: 0 auto;
  margin-top: 1em;
}
fieldset {
  background-color: #eee;
}
legend {
  background-color: #dc3545;
  width: auto;
  font-size: 1em;
}
.fa-plus-circle,
.fa-minus-circle {
  font-size: 1.3em;
}
.fa-plus-circle:hover,
.fa-minus-circle:hover {
  color: #dc3545;
}
</style>
