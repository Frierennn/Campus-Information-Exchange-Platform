<template>
  <div class="about">
    <v-header />
    <vipnavbar></vipnavbar>

    <div class="container">
      <el-page-header @back="goBack" content="新闻文章发布"> </el-page-header
      ><br />
      <div class="form-box">
        <el-form label-width="160px" :model="form" :rules="rules" ref="form">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="发布分区">
            <el-select v-model="form.region" placeholder="发布分区">
              <el-option label="轮播" value="0"></el-option>
              <el-option label="快讯" value="1"></el-option>
              <el-option label="视频" value="2"></el-option>
              <el-option label="媒体" value="3"></el-option>
            </el-select>
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

          <el-form-item label="文章简略">
            <el-input v-model="form.text" type="textarea" :rows="5"></el-input>
          </el-form-item>

          <el-form-item label="正文" style="width: 980px">
            <textarea
              id="summernote"
              name="editordata"
              rows="5"
              v-model="form.detail"
            ></textarea>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')"
              >表单提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import vipnavbar from "../components/vipnavbar.vue";
import vHeader from "../components/Header";
import $ from "jquery";
import axios from "axios";
export default {
  name: "vipbaseform",
  data() {
    return {
      form: {
        title: "",
        user_name: decodeURI(this.getCookie("user_name")),
        date: "",
        detail: "",
        region: "0",
        text: "",
        user_no: unescape(this.getCookie("user_no")),
      },
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          { min: 3, message: "最小长度为 3  个字符", trigger: "blur" },
        ],
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
    goBack() {
      this.$router.go(-1);
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
    onSubmit(formName) {
      this.form.detail = $("#summernote").summernote("code");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios
            .post("/upload/adddd", this.form)
            .then((res) => {
              let r = res.data;
              if (r.affectedRows == 1) {
                this.$message.success("提交成功！");
                this.$router.push("/vipnews");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
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
    vipnavbar,
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
