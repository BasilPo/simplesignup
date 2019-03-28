<template>
  <div id="app">
    <Navbar v-if="$route.meta.requiresNavbar"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/shared/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar
  },
  data() {
    return {};
  }
};
</script>

<style>
body {
  background: #343a40;
  
}
</style>
