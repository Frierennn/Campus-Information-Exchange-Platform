<template>
  <el-container class="cennter" style="align-items: center; height: 100%">
    <el-header style="height: 130px; width: 100%">
      <el-image
        style="height: 130px; width: 100%"
        :src="require('../assets/header.jpg')"
        fit=" contain "
      ></el-image>
    </el-header>

    <el-main
      style="
        display: flex;
        flex-flow: column;
        align-items: center;
        width: 980px;
      "
    >
      <div style="width: 100%">
        <el-divider><h1>注册</h1></el-divider>
      </div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        style="width: 500px; text-align: center"
      >
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
          >
            <template #prepend>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            type="code"
            placeholder="请输入邮箱验证码"
            v-model="param.code"
            @keyup.enter="register()"
          >
            <template #prepend>
              <el-button v-show="show" class="getCode" @click="code()"
                >点击获取</el-button
              >
              <span v-show="!show" class="count">{{ count }}s后重新获取</span>
            </template>
          </el-input>
        </el-form-item>

        <div class="reg-btn">
          <el-button type="primary" @click="register()">注册</el-button>
        </div>
      </el-form>
      <br />
      <div style="width: 100%; text-align: center">
        <router-link to="/Login">⇛ 已有账号，直接登录</router-link>
      </div>
      <br />
      <div style="width: 100%; text-align: center">
        注册即代表你同意用户协议和隐私政策
      </div>
    </el-main>
  </el-container>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      show: true,
      count: "",
      timer: null,
      param: {
        user_no: "",
        password: "",
        code: "",
        date: "",
      },
      rules: {
        user_no: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
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

    register() {
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
      this.param.date = _this.gettime;

      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!this.param.user_no) {
        this.$notify.error({
          title: "错误",
          message: "邮箱不能为空",
        });
      } else if (mailReg.test(this.param.user_no)) {
        this.$refs.login.validate((valid) => {
          if (valid) {
            axios
              .post("/users/reg", {
                user_no: this.param.user_no,
                password: this.param.password,
                code: this.param.code,
                date: this.param.date,
              })
              .then((res) => {
                let r = res.data;
                if (r.flag == true) {
                  this.$notify({
                    title: "成功",
                    message: r.msg,
                    type: "success",
                  });
                  setTimeout(() => {
                    this.$router.push({ path: "/Login" });
                  }, 500);
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
              message: "请输入邮箱、密码和验证码",
            });
            return false;
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: "请输入正确的邮箱格式",
        });
      }
    },

    code() {
      const TIME_COUNT = 60;
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!this.param.user_no) {
        this.$notify.error({
          title: "错误",
          message: "邮箱不能为空",
        });
      } else if (mailReg.test(this.param.user_no)) {
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }

        axios
          .post("/users/code", {
            user_no: this.param.user_no,
          })
          .then((res) => {
            let r = res.data;
            //console.log(res);
            if (r.flag == true) {
              this.$notify({
                title: "成功",
                message: r.msg,
                type: "success",
              });
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
          message: "请输入正确的邮箱格式",
        });
      }
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
</style>
