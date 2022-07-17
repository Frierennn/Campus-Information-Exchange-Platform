<template>
  <div class="about">
    <v-header />
    <vipnavbar></vipnavbar>
  </div>
</template>

<script>
import vipnavbar from "../components/vipnavbar.vue";
import vHeader from "../components/Header";
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },

    checkpassword() {
      var user_no = this.getCookie("user_no");
      var password = this.getCookie("password");
      axios
        .post("/users/viplogin", {
          user_no: user_no,
          password: password,
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            console.log(r);
          } else {
            this.$router.push({ path: "/Wtbhome" });
          }
        });
    },
  },
  mounted() {
    this.checkpassword();
  },
  components: {
    vipnavbar,
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