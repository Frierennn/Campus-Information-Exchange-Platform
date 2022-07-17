<template>
  <div class="header">
    <h2 class="logo">Utopia</h2>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <div>
          <el-avatar :src="imgUrl" fit="scale-down" size="medium"></el-avatar>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu name="dropdown">
            <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import cookie from "../utils/cookie.js";
import axios from "axios";
export default {
  data() {
    return {
      imgUrl: require("../assets/img/img.jpg"),
      name: "游客",
      message: 2,
    };
  },
  computed: {
    collapse() {
      return this.$store.state.collapse;
    },
  },
  methods: {
    logout() {
      cookie.clearCookie("user_no");
      cookie.clearCookie("user_name");
      cookie.clearCookie("state");
      cookie.clearCookie("date");
      cookie.set("refresh", "true");
    },

    handleCommand(command) {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      this.$message(command);
      this.$router.push("/");
    },

    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },

    getUserdata() {
      if (this.getCookie("user_name")) {
        this.name = decodeURI(this.getCookie("user_name"));
      }
      if (this.getCookie("img")) {
        this.imgUrl = unescape(this.getCookie("img"));
      }
    },
  },
  mounted() {
    this.getUserdata();
  },
};
</script>
<style scoped>
.header {
  background: #387298;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.header .logo {
  padding-left: 30px;
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.logo {
  float: left;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>
