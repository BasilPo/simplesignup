<template>
  <div class="addpoll container-fluid">
    <div class="card text-dark" id="add-poll">
      <div class="card-header">
        <span id="curindex" class="badge badge-danger badge-pill">current: {{curQuestionIndex+1}}</span>
        <span id="curindex" class="badge badge-dark badge-pill ml-1">saved: {{questions.length}}</span>
        <h3 class="text-center">Create a new poll</h3>
      </div>
      <div class="card-body">
        <p class="text-danger text-center" v-if="feedback">{{feedback}}</p>
        <form @submit.prevent>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Title</span>
            </div>
            <input type="text" class="form-control" placeholder="Poll Header" v-model="title">
          </div>
          <fieldset class="px-3 rounded">
            <legend class="rounded px-1 text-light">Add a question</legend>
            <div class="form-group">
              <label>Title</label>
              <textarea class="form-control" name="question-title" v-model="questionTitle"></textarea>
            </div>
            <div class="form-group">
              <label>Id</label>
              <input type="text" name="question-id" class="form-control" v-model="questionId">
            </div>
            <p v-if="answers.length">Answers:</p>
            <div v-for="(answer, index) in answers" :key="index" class="form-control p-0 mb-2">
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
        <button @click="addPoll" type="button" class="btn btn-danger mr-auto">Save Poll</button>
        <button
          @click="prevQuestion"
          type="button"
          class="btn btn-outline-danger mr-1"
          v-bind:disabled="!curQuestionIndex"
        >Previous Question</button>
        <button @click="nextQuestion" type="button" class="btn btn-outline-danger">Next Question</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
export default {
  name: "AddPoll",
  data() {
    return {
      user: null,
      feedback: null,
      title: null,
      questions: [],
      questionId: null,
      questionTitle: null,
      answers: [],
      answerId: null,
      answerTitle: null,
      curQuestionIndex: 0,
      isReady: false
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
        this.answers.push(objAnswer);
        this.answerTitle = null;
        this.answerId = null;
      }
    },
    deleteAnswer(answer) {
      this.answers.splice(this.answers.indexOf(answer), 1);
    },
    nextQuestion() {
      if (this.curQuestionIndex == this.questions.length) {
        if (this.questionId && this.questionTitle && this.answers.length) {
          let objQuestion = {};
          objQuestion.id = this.questionId;
          objQuestion.title = this.questionTitle;
          //   objQuestion.answers = this.answers;
          objQuestion.answers = this.answers.slice(); //!!!
          this.questions.push(objQuestion);
          this.curQuestionIndex++;
          this.questionId = null;
          this.questionTitle = null;
          this.answers.length = 0;
          this.isReady = true;
        }
      } else {
        if (++this.curQuestionIndex < this.questions.length) {
          this.questionId = this.questions[this.curQuestionIndex].id;
          this.questionTitle = this.questions[this.curQuestionIndex].title;
          this.answers = this.questions[this.curQuestionIndex].answers;
        } else {
          this.questionId = null;
          this.questionTitle = null;
          // this.answers.length = 0;
          this.answers = [];
        }
      }
    },
    prevQuestion() {
      if (this.curQuestionIndex > 0) {
        this.curQuestionIndex--;
        this.questionId = this.questions[this.curQuestionIndex].id;
        this.questionTitle = this.questions[this.curQuestionIndex].title;
        this.answers = this.questions[this.curQuestionIndex].answers;
      }
    },
    addPoll() {
      if (
        this.title &&
        this.questionId &&
        this.questionTitle &&
        this.answers.length &&
        !this.isReady
      ) {
        let objQuestion = {};
        objQuestion.id = this.questionId;
        objQuestion.title = this.questionTitle;
        objQuestion.answers = this.answers.slice(); //!!!
        this.questions.push(objQuestion);
        this.isReady = true;
      }
      if (this.isReady) {
        db.collection("polls")
          .add({
            title: this.title,
            user_id: this.user.uid,
            questions: this.questions
          })
          .then(() => {
            this.$router.push({ name: "ViewProfile" });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.feedback = "You must fill in all the fields";
      }
    }
  },
  created() {
    this.user = firebase.auth().currentUser;
  }
};
</script>

<style>
#add-poll {
  max-width: 80%;
  width: 80%;
  margin: 0 auto;
  margin-top: 1em;
  max-height: 565px;
  overflow: auto;
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
