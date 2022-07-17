<template>
  <div class="about">
    <v-header />
    <navbar></navbar>

    <div class="container">
      <el-page-header @back="goBack" content="文章编辑"> </el-page-header>
      <div class="crumbs baseform">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="container">
        <div class="form-box">
          <el-form label-width="160px">
            <el-form-item label="文章标题">
              <el-input v-model="form.title" style=""></el-input>
            </el-form-item>

            <el-form-item label="发布者">
              <el-input
                :disabled="true"
                v-model="form.user_name"
                e="width: 160px"
              ></el-input>
            </el-form-item>

            <el-form-item label="发布日期">
              <el-input
                :disabled="true"
                v-model="form.date"
                e="width: 160px"
              ></el-input>
            </el-form-item>

            <el-form-item label="文章简略" v-if="form.text != ''">
              <el-input
                v-model="form.text"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>

            <el-form-item label="正文" style="width: 980px">
              <textarea
                id="summernote"
                name="editordata"
                rows="5"
                v-model="form.detail"
                style="height: 100%px"
              ></textarea>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存发布</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import vHeader from "../components/Header";
import $ from "jquery";
import axios from "axios";
export default {
  data() {
    return {
      user_no: "",
      form: {
        title: "",
        date: "",
        user_name: "",
        text: "",
      },
      index: "",
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
    //用户角色
    checkuserno(user_no) {
      this.user_no = unescape(this.getCookie("user_no"));
      console.log(this.user_no == "vip");
      if (this.user_no == "vip") {
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
      } else if (this.user_no != user_no) {
        const h = this.$createElement;
        this.$notify({
          title: "提示",
          message: h("i", { style: "color: teal" }, "无法编辑"),
        });
        this.$router.push({ path: "/Wtbhome" });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    //获取
    fetchNotes() {
      (this.index = this.$route.params.id),
        axios
          .get("/upload/update/" + this.index)
          .then((res) => {
            this.checkuserno(res.data[0].user_no);
            this.form.title = res.data[0].title;
            this.form.user_name = res.data[0].user_name;
            if (res.data[0].text) {
              this.form.text = res.data[0].text;
            }
            $("#summernote").summernote("pasteHTML", res.data[0].remark);
          })
          .catch((err) => {
            console.log(err);
          });
    },

    getdate() {
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
      this.form.date = _this.gettime;
    },
    //文章提交
    onSubmit() {
      let title = this.form.title;
      let user_name = this.form.user_name;
      let date = this.form.date;
      let text = this.form.text;
      let formData = new FormData();
      let content = $("#summernote").summernote("code");
      formData.append("title", title);
      formData.append("date", date);
      formData.append("user_name", user_name);
      formData.append("detail", content);
      if (this.form.text != "") {
        formData.append("text", text);
      }
      //console.log(content);
      axios
        .post("/upload/update/" + this.index, formData)
        .then((res) => {
          let r = res.data;
          if (r.affectedRows == 1) {
            this.$message.success("提交成功！");
            this.$router.push("/info");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.fetchNotes();
    this.getdate();
    $(document).ready(function () {
      $("#summernote").summernote({
        height: 200,
        placeholder: "请添加文字内容",
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "underline", "clear"]],
          ["fontname", ["fontname"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview", "help"]],
        ],
        callbacks: {
          onImageUpload: function (files) {
            let formData = new FormData();
            files = Array.from(files);
            files.forEach((file) => {
              formData.append("pic", file);
            });
            axios
              .post("/upload/up", formData)
              .then((res) => {
                console.log(res);
                res.data.forEach((url) => {
                  let okurl = "\\" + url;
                  $("#summernote").summernote("insertImage", okurl);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      });
    });
  },
  components: {
    navbar,
    vHeader,
  },
};
</script>
<style scoped>
.container {
  width: 980px;
  padding-top: 20px;
}
</style>