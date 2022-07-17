<template>
  <div class="about">
    <v-header />
    <navbar></navbar>
    <!-- 文章 -->
    <div class="container">
      <el-page-header @back="goBack" content="文章详情"> </el-page-header>
      <br />
      <h1 style="font-size: 24px">{{ notes.title }}</h1>
      <br />
      <!-- 文章作者 -->
      <div class="avatar">
        <router-link
          :to="{ path: '/user', query: { index: notes.user_no } }"
          style="display: flex; flex-flow: row; align-items: center"
        >
          <el-avatar size="medium" :src="notes.circleUrl"></el-avatar
          >&nbsp;&nbsp;
          <div>{{ notes.user_name }}</div> </router-link
        >&nbsp;&nbsp;
        <img src="../assets/vip.png" style="width: 20px" v-if="vip" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div>{{ notes.date }}</div>
      </div>
      <br />
      <!-- 文章信息 -->
      <el-card
        class="box-card"
        :body-style="{ padding: '15px' }"
        style="width: 100%"
      >
        <i class="el-icon-view">&nbsp;{{ notes.fan }}</i
        >&nbsp;&nbsp;&nbsp;&nbsp;<img :src="zzan" style="width: 15px" />&nbsp;{{
          notes.zan
        }}&nbsp;&nbsp;&nbsp;&nbsp;<i :class="collecticon"></i>&nbsp;{{
          notes.collect
        }}
      </el-card>
      <br />
      <!-- 文章详情 -->
      <el-card class="box-card" style="width: 100%">
        <div class="detail">
          <p v-html="notes.notedetail"></p>
        </div>
      </el-card>
      <br />
      <!-- 文章功能 -->
      <div v-if="hide2">
        <el-button
          style="width: 100px"
          type="primary"
          size="large"
          @click="likes()"
          >{{ but1 }}</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          size="large"
          @click="collect()"
          >{{ but2 }}</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          size="large"
          @click="report()"
          >{{ but3 }}</el-button
        >
      </div>
    </div>
    <!-- 评论区 -->
    <div class="container">
      <div class="comment">
        <h1 style="font-size: 20px">评论</h1>
        &nbsp;&nbsp;
        <div style="font-size: 10px">{{ tableData1.length }}</div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="text" :disabled="disn" @click="newc()">最新</el-button
        ><el-divider direction="vertical"></el-divider
        ><el-button type="text" :disabled="dish" @click="hotc()"
          >最热</el-button
        >
      </div>
      <!-- 评论发表 -->
      <div v-show="hide1" style="text-align: center">
        <br />
        <h1>注册体验更多内容</h1>
        <br />
        <el-button type="success" @click="register()">注册&nbsp; ></el-button>
        <el-divider></el-divider>
      </div>
      <el-form
        v-show="hide2"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="comment"
        style="padding: 10px"
      >
        <el-avatar size="medium" :src="circleUrl"></el-avatar>&nbsp;&nbsp;
        <el-form-item prop="textarea" style="width: 90%; padding-top: 30px">
          <el-input
            type="textarea"
            :placeholder="placeh"
            v-model="ruleForm.textarea"
            maxlength="30"
            show-word-limit
          >
          </el-input></el-form-item
        >&nbsp;&nbsp;
        <el-button
          type="primary"
          style="height: 100%"
          @click="submitForm('ruleForm')"
          >发送</el-button
        >
      </el-form>
      <!-- 主楼 -->
      <div>
        <el-table
          ref="refTable"
          :data="tableData1"
          style="width: 100%"
          stripe
          :show-header="false"
        >
          <el-table-column prop="zan" label="赞" sortable width="1px">
            <template #default="scope"></template>
          </el-table-column>
          <el-table-column prop="date" label="时间" sortable width="1px">
            <template #default="scope"></template>
          </el-table-column>

          <el-table-column width="900px">
            <template #default="scope">
              <router-link
                :to="{ path: '/user', query: { index: scope.row.user_no } }"
                style="display: flex; flex-flow: row; align-items: center"
              >
                <el-avatar size="medium" :src="scope.row.img"></el-avatar
                >&nbsp;&nbsp;
                <div>{{ scope.row.user_name }}</div>
              </router-link>
              <div style="padding-left: 50px">
                {{ scope.row.comment }}
              </div>
              <!-- :src="tableData1[scope.$index].zanimg" -->
              <div style="padding-left: 50px; padding-top: 10px">
                {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;<a name="1"
                  ><img
                    :id="scope.row.id"
                    :src="checkczan(scope.row.czan)"
                    style="width: 2%"
                    @click="zzzanc(scope)"
                  />&nbsp;{{ scope.row.zan }}</a
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button
                  type="text"
                  style="color: black"
                  @click="
                    pdrawer(
                      scope.row.id,
                      scope.row.user_name,
                      scope.row.user_no
                    )
                  "
                  :id="scope.row.id"
                  v-show="hide2"
                  >回复
                  <!-- {{getData(scope.row.id) ? getData(scope.row.id).length : 0}} -->
                  {{ getData(scope.row.hcomment) }} </el-button
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <el-popconfirm
                  confirm-button-text="好的"
                  cancel-button-text="不用了"
                  @confirm="del(scope.row.id)"
                  icon="el-icon-info"
                  icon-color="red"
                  title="删除评论后，评论下所有回复都会被删除是否继续？"
                >
                  <el-button
                    v-show="hide2"
                    type="text"
                    slot="reference"
                    v-if="scope.row.user_no == user_no"
                    >删除</el-button
                  >
                  <el-button
                    v-show="hide2"
                    type="text"
                    slot="reference"
                    v-if="checkpassword(user_no)"
                    >删除</el-button
                  >
                </el-popconfirm>
                <el-divider content-position="left"
                  ><el-button type="text" @click="show(scope.row.id)"
                    >查看回复</el-button
                  >
                </el-divider>
                <!-- 副楼 -->
                <div :class="getClass(scope.row.id)" style="display: none">
                  <!-- :data="getData(scope.row.id)" -->
                  <el-table
                    :data="scope.row.hcomment"
                    style="width: 100%"
                    :show-header="false"
                  >
                    <el-table-column width="width: 100%">
                      <template #default="scope">
                        <router-link
                          :to="{
                            path: '/user',
                            query: { index: scope.row.user_no },
                          }"
                          style="
                            display: flex;
                            flex-flow: row;
                            align-items: center;
                          "
                        >
                          <el-avatar
                            size="medium"
                            :src="scope.row.img"
                          ></el-avatar
                          >&nbsp;&nbsp;
                          <div>{{ scope.row.user_name }}</div>
                        </router-link>
                        <div style="padding-left: 50px">
                          {{ scope.row.comment }}
                        </div>
                        <div style="padding-left: 50px; padding-top: 10px">
                          {{
                            scope.row.date
                          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button
                            v-show="hide2"
                            type="text"
                            @click="
                              pdrawer(
                                scope.row.state,
                                scope.row.user_name,
                                scope.row.user_no
                              )
                            "
                            :id="scope.row.id"
                            >回复</el-button
                          >&nbsp;&nbsp;&nbsp;&nbsp;

                          <el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="不用了"
                            @confirm="del(scope.row.id)"
                            icon="el-icon-info"
                            icon-color="red"
                            title="删除评论后，评论下所有回复都会被删除是否继续？"
                          >
                            <el-button
                              v-show="hide2"
                              type="text"
                              slot="reference"
                              v-if="scope.row.user_no == user_no"
                              >删除</el-button
                            >
                            <el-button
                              v-show="hide2"
                              type="text"
                              slot="reference"
                              v-if="checkpassword(user_no)"
                              >删除</el-button
                            >
                          </el-popconfirm>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 下抽屉评论发表 -->
    <div style="width: 100%">
      <el-drawer
        style="width: 100%; text-align: center"
        size="14%"
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false"
        direction="btt"
        @close="onClose"
      >
        <el-form
          style="width: 980px; display: inline-block"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="comment"
        >
          <div class="comment">
            <el-avatar size="medium" :src="circleUrl"></el-avatar>&nbsp;&nbsp;
            <el-form-item prop="textarea" style="width: 90%; padding-top: 30px">
              <el-input
                type="textarea"
                :placeholder="placeh"
                v-model="ruleForm.textarea"
                maxlength="30"
                show-word-limit
              >
              </el-input></el-form-item
            >&nbsp;&nbsp;
            <el-button
              type="primary"
              style="height: 100%"
              @click="submitForm('ruleForm')"
              >发送</el-button
            >
          </div>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import navbar from "../components/navbar.vue";
import vHeader from "../components/Header";
import axios from "axios";
export default {
  data() {
    return {
      collecticon: "el-icon-star-off",
      fq: this.$route.params.id.charAt(0),
      sort: { prop: "zan", order: "descending" },
      disn: true,
      dish: false,
      but1: "点赞",
      but2: "收藏",
      but3: "举报",
      zzan: require("../assets/zan.png"),
      zzzan: require("../assets/zan.png"),
      zzzann: 1,
      hide1: true,
      hide2: false,
      vip: false,
      placeh: "发送一条友善的评论",
      drawer: false,
      ruleForm: {
        textarea: "",
        notesid: "",
        state: 0,
        cuser_no: "",
      },
      rules: {
        textarea: [
          { required: true, message: "请输入评论内容", trigger: "blur" },
          { min: 1, message: "长度至少为 1 字符", trigger: "blur" },
        ],
      },
      notes: {
        notedetail: [],
        date: "",
        zan: "",
        fan: "",
        circleUrl: "",
        title: "",
        user_name: "",
        user_no: "",
        collect: "",
      },
      atname: "",
      hcomment: {},
      user_name: "",
      user_no: "",
      circleUrl: "",
      comment: "0",
      index: this.$route.params.id,
      tableData1: [],
    };
  },
  methods: {
    //评论check点赞
    checkczan(czan) {
      if (czan == 1) {
        return require("../assets/zann.png");
      } else {
        return require("../assets/zan.png");
      }
    },
    checkpassword(no) {
      return no == "vip";
    },
    //文章点赞和取消点赞按钮
    likes() {
      if (this.but1 == "点赞") {
        axios
          .get("/upload/likes", {
            params: {
              user_no: this.user_no,
              user_name: this.user_name,
              notesid: this.$route.params.id,
              cuser_no: this.notes.user_no,
              title: this.notes.title,
              date: this.getdate(),
              state: 1,
            },
          })
          .then((res) => {
            if (res.data.flag == false) {
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.checklikes();
              // this.notes.zan++;
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            }
          });
      } else {
        axios
          .get("/upload/likes", {
            params: {
              user_no: this.user_no,
              notesid: this.$route.params.id,
              state: 0,
            },
          })
          .then((res) => {
            if (res.data.flag == false) {
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.checklikes();
              // this.notes.zan--;
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            }
          });
      }
    },
    //收藏和取消收藏按钮
    collect() {
      if (this.but2 == "收藏") {
        axios
          .get("/upload/collect", {
            params: {
              user_no: this.user_no,
              notesid: this.$route.params.id,
              title: this.notes.title,
              state: 1,
            },
          })
          .then((res) => {
            if (res.data.flag == false) {
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.checkcollect();
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            }
          });
      } else {
        axios
          .get("/upload/collect", {
            params: {
              user_no: this.user_no,
              notesid: this.$route.params.id,
              state: 0,
            },
          })
          .then((res) => {
            if (res.data.flag == false) {
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.checkcollect();
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            }
          });
      }
    },
    //举报和取消举报按钮
    report() {
      console.log(this.$route.params.id);
      if (this.but3 == "举报") {
        this.$prompt("为帮助审核人员更快处理，请补充详细信息", "举报", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            axios
              .get("/upload/report", {
                params: {
                  user_no: this.user_no,
                  notesid: this.$route.params.id,
                  title: this.notes.title,
                  report: value,
                  date: this.getdate(),
                  state: 1,
                },
              })
              .then((res) => {
                if (res.data.flag == false) {
                  this.$notify({
                    title: "成功",
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.checkreport();
                  this.$notify({
                    title: "成功",
                    message: res.data.msg,
                    type: "success",
                  });
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        axios
          .get("/upload/report", {
            params: {
              user_no: this.user_no,
              notesid: this.$route.params.id,
              state: 0,
            },
          })
          .then((res) => {
            if (res.data.flag == false) {
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.checkreport();
              this.$notify({
                title: "成功",
                message: res.data.msg,
                type: "success",
              });
            }
          });
      }
    },
    //文章举报检验
    checkreport() {
      axios
        .get("/upload/checkreport", {
          params: {
            user_no: this.user_no,
            notesid: this.$route.params.id,
          },
        })
        .then((res) => {
          this.but3 = res.data.msg;
        });
    },
    //文章收藏检验
    checkcollect() {
      axios
        .get("/upload/checkcollect", {
          params: {
            user_no: this.user_no,
            notesid: this.$route.params.id,
          },
        })
        .then((res) => {
          this.but2 = res.data.msg;
          this.notes.collect = res.data.count;
          if (res.data.msg == "收藏") {
            this.collecticon = "el-icon-star-off";
          } else {
            this.collecticon = "el-icon-star-on";
          }
        });
    },
    //文章文章点赞检验
    checklikes() {
      axios
        .get("/upload/checklikes", {
          params: {
            user_no: this.user_no,
            notesid: this.$route.params.id,
          },
        })
        .then((res) => {
          this.but1 = res.data.msg;
          this.notes.zan = res.data.count;
          if (res.data.msg == "点赞") {
            this.zzan = require("../assets/zan.png");
          } else {
            this.zzan = require("../assets/zann.png");
          }
        });
    },
    //评论点赞检验（寄）
    checkclikes() {
      axios
        .get("/comment/checkclikes", {
          params: {
            user_no: this.user_no,
            notesid: this.$route.params.id,
          },
        })
        .then((res) => {
          this.but1 = res.data.msg;
          this.notes.zan = res.data.count;
          if (res.data.msg == "点赞") {
            this.zzan = require("../assets/zan.png");
          } else {
            this.zzan = require("../assets/zann.png");
          }
        });
    },
    //热门评论
    newc() {
      this.disn = true;
      this.dish = false;
      this.$refs.refTable.sort("date", "descending");
    },
    //最新评论
    hotc() {
      this.disn = false;
      this.dish = true;
      this.$refs.refTable.sort("zan", "descending");
    },
    //评论点赞
    zzzanc(scope) {
      console.log(scope.row.czan);
      let index = scope.$index;
      let czan = scope.row.czan;
      if (this.user_no != "") {
        if (this.user_no == 0) {
          this.$message.success("注册体验更多内容");
        } else {
          if (czan == 1) {
            axios
              .post("/comment/zzzan", {
                data: {
                  scope: scope.row,
                  czan: czan,
                },
              })
              .then((res) => {
                this.$message.success("取消点赞成功！");
                this.tableData1[index].czan = 0;
                document.getElementById(
                  scope.row.id
                ).src = require("../assets/zan.png");
                this.tableData1[index].zan--;
              });
          } else {
            axios
              .post("/comment/zzzan", {
                data: {
                  scope: scope.row,
                  czan: czan,
                },
              })
              .then((res) => {
                this.$message.success("赞赞赞！");
                this.tableData1[index].czan = 1;
                document.getElementById(
                  scope.row.id
                ).src = require("../assets/zann.png");
                this.tableData1[index].zan++;
              });
          }
        }
      }
    },
    //注册跳转
    register() {
      this.$router.push({ path: "/Register" });
    },
    //回复楼层class
    getClass(id) {
      return id.toString();
    },
    //回复楼层table
    getData(hc) {
      if (hc) {
        return hc.length;
      } else {
        return 0;
      }
      // var id5 = "hc" + id.toString();
      // return this.hcomment[id5];
    },
    //展开关回复
    show(id) {
      var id2 = document.getElementsByClassName(id.toString());
      if (id2[0].style.display == "block") {
        id2[0].style.display = "none";
      } else {
        id2[0].style.display = "block";
      }
    },
    //展开回复
    showhold(id) {
      if (id == 0) {
        return;
      }
      var id2 = document.getElementsByClassName(id.toString());
      id2[0].style.display = "block";
    },
    //评论删除
    del(id) {
      axios
        .get("/comment/commentdel/" + this.fq + id)
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.$notify({
              title: "成功",
              message: r.msg,
              type: "success",
            });
            //评论刷新
            axios.get("/comment/comment/" + this.index).then((response) => {
              let res = response.data;
              this.tableData1 = res;
              //回复刷新
              // for (let index in res) {
              //   let id4 = "hc" + res[index].id.toString();
              //   axios
              //     .get("/comment/hcomment/" + res[index].id)
              //     .then((res4) => {
              //       this.$set(this.hcomment, id4, res4.data);
              //     })
              //     .catch((err) => {
              //       console.log(err);
              //     });
              // }
            });
          } else {
            this.$notify({
              title: "错误",
              message: r.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取时间
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
      return _this.gettime;
    },
    //关闭抽屉评论赋值
    onClose() {
      this.ruleForm.state = 0;
      this.placeh = "发送一条友善的评论";
      this.ruleForm.textarea = "";
    },
    //打开抽屉评论赋值
    pdrawer(id, name, user_no) {
      this.ruleForm.cuser_no = user_no;
      this.atname = name;
      this.placeh = "@" + name + "：";
      this.drawer = true;
      this.ruleForm.state = id;
    },
    //发送评论到服务器
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.state > 0) {
            this.ruleForm.textarea =
              "@" + this.atname + "：" + this.ruleForm.textarea;
            //console.log(this.ruleForm.cuser_no);
          }
          axios
            .post("/comment/sendcomment/", {
              notesid: this.ruleForm.notesid,
              user_no: this.user_no,
              user_name: this.user_name,
              comment: this.ruleForm.textarea,
              zan: 0,
              date: this.getdate(),
              state: this.ruleForm.state,
              img: "http://localhost:3000/uploads/" + this.user_no + ".jpg",
              index: this.index,
              cuser_no: this.ruleForm.cuser_no,
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
                this.showhold(this.ruleForm.state);
                this.ruleForm.textarea = "";
                this.drawer = false;
                //评论刷新
                axios.get("/comment/comment/" + this.index).then((response) => {
                  let res = response.data;
                  this.tableData1 = res;
                });
              } else {
                this.$notify({
                  title: "错误",
                  message: r.msg,
                });
              }
            });
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入评论内容",
          });
          return false;
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    //获取文章和评论和回复
    getDetail() {
      //文章获取
      axios.get("/upload/notedetail/" + this.index).then((res) => {
        let r = res.data;
        if (r.flag == true) {
          this.$notify.error({
            title: "错误",
            message: r.msg,
          });
        }
        this.notes.notedetail = res.data[0].remark;
        this.notes.title = res.data[0].title;
        this.notes.user_name = res.data[0].user_name;
        this.notes.date = res.data[0].date;
        // this.notes.zan = res.data[0].zan;
        this.notes.fan = res.data[0].fan;
        this.notes.user_no = res.data[0].user_no;
        this.ruleForm.notesid = res.data[0].id;
        if (res.data[0].user_no == "VIP") {
          this.vip = true;
        }
        this.notes.circleUrl =
          "http://localhost:3000/uploads/" + res.data[0].user_no + ".jpg";
      });
      //评论获取
      axios.get("/comment/comment/" + this.index).then((response) => {
        let res = response.data;
        this.tableData1 = res;
        //console.log(res);
        // res.forEach((item, index, arr) => {
        //   res[index].zanimg = require("../assets/zan.png");
        // });
        //console.log(res);
        //回复获取
        // for (let index in res) {
        //   let id4 = "hc" + res[index].id.toString();
        //   axios
        //     .get("/comment/hcomment/" + this.index.charAt(0) + res[index].id)
        //     .then((res4) => {
        //       this.$set(this.hcomment, id4, res4.data);
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // }
      });
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
        this.user_name = decodeURI(this.getCookie("user_name"));
      }
      if (this.getCookie("user_no")) {
        this.user_no = unescape(this.getCookie("user_no"));
        this.circleUrl =
          "http://localhost:3000/uploads/" + this.user_no + ".jpg";
      }
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
          this.hide1 = false;
          this.hide2 = true;
          //this.$socket.connect();
        }
      }
    },
    //滚动到指定评论
    scrollInto() {
      if (this.$route.query.cid) {
        var cid = this.$route.query.cid;
        var state = this.$route.query.state;
        if (state != 0) {
          this.showhold(state);
        }
        console.log("你倒是滑啊！！！！！");
        document.getElementById(cid).scrollIntoView(false);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.scrollInto();
    }, 1000);
    this.checkuserno();
    this.getDetail();
    this.getUserdata();
    this.checkcollect();
    this.checklikes();
    this.checkreport();
    //console.log(this.fq);
  },
  components: {
    navbar,
    vHeader,
  },
};
</script>
<style>
.comment {
  display: flex;
  flex-flow: row;
  align-items: center;
  /* text-align: center; */
  /* border: 1px black solid; */
}
.avatar {
  display: flex;
  flex-flow: row;
  align-items: center;
}
.router-link-active {
  text-decoration: none;
  color: black;
}
a {
  text-decoration: none;
  color: black;
}
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
.container {
  width: 980px;
  padding-top: 20px;
}
</style>