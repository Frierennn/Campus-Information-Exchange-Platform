<template>
  <el-collapse-transition>
    <div v-show="show">
      <el-row type="flex" justify="center" align="middle">
        <el-col type="flex" justify="center">
          <section class="showcase">
            <video src="../assets/1.mp4" muted loop autoplay></video>
            <div class="overlay"></div>
            <div class="text">
              <h2>Utopia</h2>
              <h1 style="display: inline-block">广州软件学院</h1>
              &nbsp;
              <p style="display: inline-block">校园信息交流平台</p>
              <br /><br />
              <p>
                广州软件学院成立于2002年，2006年开始实施本科层次的学历教育，前身为广州大学华软软件学院。2020年12月，经教育部批准，广东省人民政府同意，转设更名为广州软件学院。学校董事长梁冠军先生是美国著名侨领、华裔知名实业家、中华海外联谊会副会长、中国侨联顾问、中国和平统一促进会常务理事、美国美东华人社团联合总会主席。
              </p>
              <el-button @click="login()">登录/注册</el-button>
              <el-button type="success" @click="guest()">游客登录</el-button>
            </div>
          </section>
        </el-col>
      </el-row>
    </div>
  </el-collapse-transition>
</template>

<script>
// fade/zoom 等
import "element-ui/lib/theme-chalk/base.css";
// collapse 展开折叠
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import Vue from "vue";
Vue.component(CollapseTransition.name, CollapseTransition);
export default {
  data: () => ({
    show: true,
  }),

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

    login() {
      this.show = !this.show;
      document.cookie = "user_no=0";
      setTimeout(() => {
        this.$router.push({ path: "/Login" });
      }, 500);
    },

    guest() {
      this.show = !this.show;
      document.cookie = "user_no=0";
      setTimeout(() => {
        this.$router.push({ path: "/Wtbhome" });
      }, 500);
    },
  },
  mounted() {
    this.checkuserno();
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.showcase {
  position: absolute;
  right: 0;
  width: 100%;
  min-height: 100vh;
  padding: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000;
  color: #fff;
  z-index: 2;
  transition: 0.5s;
}
.text {
  position: relative;
  z-index: 10;
}

.text h1 {
  font-size: 5em;
  font-weight: 800;
  line-height: 1em;
  text-transform: uppercase;
}

.text h2 {
  font-size: 4em;
  font-weight: 700;
  line-height: 1em;
  text-transform: uppercase;
}

.text p {
  font-size: 1.1em;
  margin: 20px 0;
  font-weight: 400;
  max-width: 700px;
}
@media (max-width: 991px) {
  .showcase {
    padding: 40px;
  }

  .text h1 {
    font-size: 3em;
  }

  .text h2 {
    font-size: 2em;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: darkkhaki;
  /* background: gold; */
  mix-blend-mode: overlay;
}

.showcase video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  object-fit: cover;
}
</style>