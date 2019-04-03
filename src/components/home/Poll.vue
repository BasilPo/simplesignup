<template>
  <div class="poll container-fluid">
    <div v-if="feedback" class="alert alert-light text-center text-danger mt-4" role="alert">
      {{feedback}}.
      <router-link :to="{name:'ViewProfile'}" class="alert-link text-danger">Try again</router-link>
    </div>
    <div v-if="poll" id="poll" class="card text-dark">
      <div class="card-header">
        <span
          id="curindex"
          class="badge badge-danger badge-pill"
        >{{curQuizIndex+1}}/{{poll.questions.length}}</span>
        <h3 class="text-center">{{poll.title}}</h3>
      </div>
      <div class="card-body">
        <div>
          <h5 class="card-title">{{curQuiz.title}}</h5>
          <div class="card-text">
            <div v-for="(answer, index) in curQuiz.answers" :key="index">
              <p>{{answer.title}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <button v-if="isSubmit" @click="submit" class="btn btn-danger">Submit</button>
        <button v-if="!isSubmit" @click="nextQuiz" class="btn btn-dark">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
export default {
  name: "Poll",
  props: ["poll_id"],
  data() {
    return {
      poll: null,
      feedback: null,
      isSubmit: false,
      curQuiz: null,
      curQuizIndex: 0
    };
  },
  methods: {
    submit() {
      this.$router.push({ name: "ViewProfile" });
    },
    nextQuiz() {
      this.curQuiz = this.poll.questions[++this.curQuizIndex];
      if (this.curQuizIndex == this.poll.questions.length - 1) {
        this.isSubmit = true;
      }
    }
  },
  created() {
    db.collection("polls")
      .doc(this.poll_id)
      .get()
      .then(poll => {
        if (poll.exists) {
          this.poll = poll.data();
          this.curQuiz = this.poll.questions[this.curQuizIndex];
          this.feedback = null;
        } else {
          this.feedback = "No polls for the specified number";
        }
      })
      .catch(error => {
        console.log(error);
        this.feedback = "Something is wrong with the server";
      });
  }
};
</script>

<style>
#poll {
  max-width: 80%;
  width: 80%;
  margin: 0 auto;
  margin-top: 1em;
}
#curindex {
  font-size: 1em;
}
</style>

