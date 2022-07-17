<template>
  <div>
    <div v-if="hide1" style="text-align: center">
      <br />
      <h1>注册体验更多内容</h1>
      <br />
      <el-button type="success" @click="register()">注册&nbsp; ></el-button>
    </div>

    <div v-if="!hide1" style="padding-top: 20px">
      <el-tabs
        tab-position="left"
        style="height: 700px; width: 1080px"
        @tab-click="handleClick"
      >
        <!-- 我的回复 -->
        <el-tab-pane label="我的回复">
          <el-table
            ref="refTable"
            :data="tableData0"
            style="
              width: 100%;
              overflow: scroll;
              height: 700px;
              overflow-x: hidden;
            "
            stripe
            :show-header="false"
          >
            <el-table-column width="900px">
              <template #default="scope">
                <router-link
                  :to="{ path: '/user', query: { index: scope.row.user_no } }"
                  style="display: flex; flex-flow: row; align-items: center"
                >
                  <el-avatar size="medium" :src="scope.row.img"></el-avatar
                  >&nbsp;&nbsp;
                  <div>{{ scope.row.user_name }}&nbsp;&nbsp;回复了我的评论</div>
                </router-link>
                <div
                  style="padding-left: 50px; cursor: pointer"
                  @click="
                    detail(
                      scope.row.fq,
                      scope.row.notesid,
                      scope.row.id,
                      scope.row.state
                    )
                  "
                >
                  {{ scope.row.comment }}
                </div>
                <div style="padding-left: 50px; padding-top: 10px">
                  {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;
                  <el-popconfirm
                    confirm-button-text="好的"
                    cancel-button-text="不用了"
                    @confirm="del(scope.row.id, scope.row.fq)"
                    icon="el-icon-info"
                    icon-color="red"
                    title="删除该条通知后无法恢复，是否继续？"
                  >
                    <el-button type="text" slot="reference"
                      >删除该通知</el-button
                    >
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 文章评论 -->
        <el-tab-pane label="文章评论">
          <el-table
            ref="refTable"
            :data="tableData1"
            style="
              width: 100%;
              overflow: scroll;
              height: 700px;
              overflow-x: hidden;
            "
            stripe
            :show-header="false"
          >
            <el-table-column width="900px">
              <template #default="scope">
                <router-link
                  :to="{ path: '/user', query: { index: scope.row.user_no } }"
                  style="display: flex; flex-flow: row; align-items: center"
                >
                  <el-avatar size="medium" :src="scope.row.img"></el-avatar
                  >&nbsp;&nbsp;
                  <div>{{ scope.row.user_name }}&nbsp;&nbsp;评论了我的文章</div>
                </router-link>
                <div
                  style="padding-left: 50px; cursor: pointer"
                  @click="
                    detail(
                      scope.row.fq,
                      scope.row.notesid,
                      scope.row.id,
                      scope.row.state
                    )
                  "
                >
                  {{ scope.row.comment }}
                </div>
                <div style="padding-left: 50px; padding-top: 10px">
                  {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;
                  <el-popconfirm
                    confirm-button-text="好的"
                    cancel-button-text="不用了"
                    @confirm="del(scope.row.id, scope.row.fq)"
                    icon="el-icon-info"
                    icon-color="red"
                    title="删除该条通知后无法恢复，是否继续？"
                  >
                    <el-button type="text" slot="reference"
                      >删除该通知</el-button
                    >
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 收到的赞 -->
        <el-tab-pane label="收到的赞">
          <el-table
            ref="refTable"
            :data="tableData2"
            style="
              width: 100%;
              overflow: scroll;
              height: 700px;
              overflow-x: hidden;
            "
            stripe
            :show-header="false"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column width="900px">
              <template #default="scope">
                <div v-if="scope.row.commentid">
                  <router-link
                    :to="{ path: '/user', query: { index: scope.row.user_no } }"
                    style="display: flex; flex-flow: row; align-items: center"
                  >
                    <el-avatar size="medium" :src="scope.row.img"></el-avatar
                    >&nbsp;&nbsp;
                    <div>
                      {{ scope.row.user_name }}&nbsp;&nbsp;点赞了我的评论
                    </div>
                  </router-link>
                  <div
                    style="padding-left: 50px; cursor: pointer"
                    @click="
                      detail2(
                        scope.row.fq,
                        scope.row.notesid,
                        scope.row.commentid,
                        scope.row.state
                      )
                    "
                  >
                    {{ scope.row.comment }}
                  </div>
                  <div style="padding-left: 50px; padding-top: 10px">
                    {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-popconfirm
                      confirm-button-text="好的"
                      cancel-button-text="不用了"
                      @confirm="
                        dellikes(
                          scope.row.commentid,
                          scope.row.user_no,
                          scope.row.cuser_no,
                          (state = 1)
                        )
                      "
                      icon="el-icon-info"
                      icon-color="red"
                      title="删除该条通知后无法恢复，是否继续？"
                    >
                      <el-button type="text" slot="reference"
                        >删除该通知</el-button
                      >
                    </el-popconfirm>
                  </div>
                </div>
                <div v-else>
                  <router-link
                    :to="{ path: '/user', query: { index: scope.row.user_no } }"
                    style="display: flex; flex-flow: row; align-items: center"
                  >
                    <el-avatar size="medium" :src="scope.row.img"></el-avatar
                    >&nbsp;&nbsp;
                    <div>
                      {{ scope.row.user_name }}&nbsp;&nbsp;点赞了我的文章
                    </div>
                  </router-link>
                  <router-link
                    :to="{ path: '/notedetail/' + scope.row.notesid }"
                    style="padding-left: 50px; cursor: pointer"
                  >
                    《{{ scope.row.title }}》
                  </router-link>
                  <div style="padding-left: 50px; padding-top: 10px">
                    {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-popconfirm
                      confirm-button-text="好的"
                      cancel-button-text="不用了"
                      @confirm="
                        dellikes(
                          scope.row.notesid,
                          scope.row.user_no,
                          scope.row.cuser_no,
                          (state = 0)
                        )
                      "
                      icon="el-icon-info"
                      icon-color="red"
                      title="删除该条通知后无法恢复，是否继续？"
                    >
                      <el-button type="text" slot="reference"
                        >删除该通知</el-button
                      >
                    </el-popconfirm>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >

        <!-- 系统通知 -->
        <el-tab-pane label="系统通知">
          <el-table
            ref="refTable"
            :data="tableData3"
            style="
              width: 100%;
              overflow: scroll;
              height: 700px;
              overflow-x: hidden;
            "
            stripe
            :show-header="false"
          >
            <el-table-column width="900px">
              <template #default="scope">
                <router-link
                  :to="{ path: '/user', query: { index: VIP } }"
                  style="display: flex; flex-flow: row; align-items: center"
                >
                  <el-avatar
                    size="medium"
                    src="http://localhost:3000/uploads/VIP.jpg"
                  ></el-avatar
                  >&nbsp;&nbsp;
                  <div>乌托邦官方助手 &nbsp;&nbsp;管理员发布了通知</div>
                </router-link>
                <div style="padding-left: 50px">
                  {{ scope.row.notice }}
                </div>
                <div style="padding-left: 50px; padding-top: 10px">
                  {{ scope.row.date }}&nbsp;&nbsp;&nbsp;&nbsp;
                  <el-popconfirm
                    confirm-button-text="好的"
                    cancel-button-text="不用了"
                    @confirm="delnotice(scope.row.id)"
                    icon="el-icon-info"
                    icon-color="red"
                    title="删除该条通知后无法恢复，是否继续？"
                  >
                    <el-button type="text" slot="reference"
                      >删除该通知</el-button
                    >
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      VIP: "VIP",
      hide1: true,
      user_no: "",
      tableData0: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
    };
  },

  methods: {
    //标签页切换
    handleClick(tab) {
      if (tab.index == 1 && this.tableData1.length == 0) {
        this.getData1();
      } else if (tab.index == 2 && this.tableData2.length == 0) {
        this.getData2();
      } else if (tab.index == 3 && this.tableData3.length == 0) {
        this.getData3();
      }
    },
    //回复跳转
    detail(fq, notesid, id, state) {
      this.$router.push({
        path: "/notedetail/" + fq + notesid,
        query: { cid: id, state: state },
      });
    },
    //回复跳转2
    detail2(fq, notesid, id, state) {
      let cid = id.toString();
      cid = cid.substr(1);
      this.$router.push({
        path: "/notedetail/" + fq + notesid,
        query: { cid: cid, state: state },
      });
    },
    //删除我的回复
    del(id, fq) {
      console.log(id, fq);
      axios
        .get("/comment/delmsg", {
          params: {
            cid: id,
            fqid: fq,
          },
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.$notify({
              title: "成功",
              message: r.msg,
              type: "success",
            });
            this.getData0();
            this.getData1();
          } else {
            this.$notify({
              title: "错误",
              message: r.msg,
              type: "error",
            });
          }
        });
    },
    //删除收到的赞
    dellikes(id, no, cno, state) {
      if (state == 1) {
        axios
          .get("/comment/dellikes", {
            params: {
              cid: id,
              user_no: no,
              cuser_no: cno,
              state: state,
            },
          })
          .then((res) => {
            let r = res.data;
            if (r.flag == true) {
              this.$notify({
                title: "成功",
                message: r.msg,
                type: "success",
              });
              this.getData2();
            } else {
              this.$notify({
                title: "错误",
                message: r.msg,
                type: "error",
              });
            }
          });
      } else {
        axios
          .get("/comment/dellikes", {
            params: {
              notesid: id,
              user_no: no,
              cuser_no: cno,
              state: state,
            },
          })
          .then((res) => {
            let r = res.data;
            if (r.flag == true) {
              this.$notify({
                title: "成功",
                message: r.msg,
                type: "success",
              });
              this.getData2();
            } else {
              this.$notify({
                title: "错误",
                message: r.msg,
                type: "error",
              });
            }
          });
      }
    },
    //删除系统通知
    delnotice(id) {
      //alert(id);
      axios
        .get("/comment/delnotice", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.$notify({
              title: "成功",
              message: r.msg,
              type: "success",
            });
            //this.getData0();
            //this.getData1();
            //this.getData2();
            this.getData3();
          } else {
            this.$notify({
              title: "错误",
              message: r.msg,
              type: "error",
            });
          }
        });
    },
    //获取我的回复
    getData0() {
      axios.get("/comment/reply").then((res) => {
        // console.log(res.data);
        this.tableData0 = res.data;
      });
    },
    //获取我的评论
    getData1() {
      axios.get("/comment/mycomment").then((res) => {
        // console.log(res.data);
        this.tableData1 = res.data;
      });
    },
    //获取收到的赞
    getData2() {
      axios.get("/comment/likes").then((res) => {
        //console.log(res.data);
        this.tableData2 = res.data;
      });
    },
    //获取我的通知
    getData3() {
      axios.get("/comment/notice").then((res) => {
        //console.log(res.data);
        this.tableData3 = res.data;
      });
    },
    register() {
      this.$router.push({ path: "/Register" });
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
          this.user_no = unescape(this.getCookie("user_no"));
          this.hide1 = false;
        }
      }
    },
  },

  mounted() {
    this.getData0();
    this.checkuserno();
  },
};
</script>
<style scoped>
.router-link-active {
  text-decoration: none;
  color: #ffd04b;
}
a {
  text-decoration: none;
  color: black;
}
</style>