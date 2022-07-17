<template>
  <div class="about">
    <v-header />
    <navbar></navbar>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import vHeader from "../components/Header";
export default {
  data() {
    return {
    };
  },
  methods: {},
  mounted() {},
  components: {
    navbar,
    vHeader,
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
</style>