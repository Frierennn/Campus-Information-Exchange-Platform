<template>
  <el-container class="cennter" style="align-items: center; height: 100%">
    <el-header style="height: 130px; width: 100%">
      <el-image
        style="height: 130px; width: 100%"
        :src="require('../assets/header.jpg')"
        fit=" contain "
      ></el-image>
    </el-header>

    <el-main style="width: 980px">
      <div style="width: 100%">
        <el-divider><h1>登录</h1></el-divider>
      </div>
      <div
        style="
          padding-top: 20px;
          padding-bottom: 20px;
          display:flex;
          flex-flow：row;
        "
      >
        <div
          class="center"
          style="
            flex-flow: column;
            align-items: center;
            border-right: darkgray solid 1px;
            width: 50%;
          "
        >
          <div>公众号二维码</div>
          <br />
          <el-image
            style="width: 200px; height: 200px"
            :src="require('../assets/WeChat.jpg')"
            fit="fill"
          ></el-image>
        </div>

        <div
          class="center"
          style="flex-flow: column; align-items: center; width: 50%"
        >
          <div>邮箱登录</div>
          <br />
          <el-form :model="param" :rules="rules" ref="login" label-width="0px">
            <el-form-item prop="user_no">
              <el-input v-model="param.user_no" placeholder="请输入邮箱">
                <template #prepend>
                  <i class="el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="param.password"
                show-password
              >
                <template #prepend>
                  <i class="el-icon-lock"></i>
                </template>
              </el-input>
            </el-form-item>

            <div class="login-btn">
              <div class="log-btn">
                <el-button type="primary" @click="login()">登录</el-button>
              </div>
              <div class="log-btn">
                <el-button type="primary" @click="guest()">游客登录</el-button>
              </div>
              <div class="reg-btn">
                <el-button type="success" @click="register()"
                  >注册&nbsp; ></el-button
                >
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <br />
      <div style="width: 100%; text-align: center">
        <router-link to="/Reset">⇛ 忘记密码，点此重置</router-link>
      </div>
      <br />
      <div style="width: 100%; text-align: center">
        登录即代表你同意用户协议和隐私政策
      </div>
    </el-main>
  </el-container>
</template>


<script>
import axios from "axios";
import cookie from "../utils/cookie.js";
export default {
  data() {
    return {
      param: {
        user_no: "",
        password: "",
        date: "",
      },
      rules: {
        user_no: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // {
          //   type: "email", //要检验的类型（number，email，date等）
          //   message: "请输入正确的邮箱地址",
          //   trigger: ["blur", "change"],
          // },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },

  methods: {
    guest() {
      this.show = !this.show;
      document.cookie = "user_no=0";
      setTimeout(() => {
        this.$router.push({ path: "/Wtbhome" });
      }, 500);
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

    checkuserno() {
      var userno = this.getCookie("user_no");
      if (userno != "") {
        if (userno == 0) {
          console.log("游客已登录");
        } else {
          this.$router.push({ path: "/Wtbhome" });
        }
      }
    },

    getDate() {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "/" + mm + "/" + dd + " " + hh + ":" + mf + ":" + ss;
      return _this.gettime;
    },
    login() {
      this.date = this.getDate();
      this.$refs.login.validate((valid) => {
        if (valid) {
          cookie.clearCookie("user_no");
          axios
            .post("/users/login", {
              user_no: this.param.user_no,
              password: this.param.password,
              date: this.date,
            })
            .then((res) => {
              let r = res.data;
              //console.log(res);
              if (r.flag == true) {
                // this.$socket.connect();
                //var userno = unescape(this.getCookie("user_no"));
                // this.$socket.emit("login", { name: userno }, (result) => {
                //   console.log(result);
                // });
                this.$notify({
                  title: "成功",
                  message: r.msg,
                  type: "success",
                });
                this.$router.push({ path: "/Wtbhome" });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: r.msg,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入邮箱和密码",
          });
          return false;
        }
      });
    },

    register() {
      this.$router.push({ path: "/Register" });
    },
  },
  mounted() {
    this.checkuserno();
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
.center {
  height: 100%;
  display: flex;
  justify-content: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
