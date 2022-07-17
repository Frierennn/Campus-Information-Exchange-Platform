<template>
  <div class="about">
    <v-header />
    <navbar></navbar>
    <div class="container">
      <el-page-header @back="goBack" content="用户信息"> </el-page-header><br />
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div class="user-info">
              <img :src="img" class="user-avator" alt />
              <div class="user-info-cont">
                <div class="user-info-name">{{ name }}</div>
                <div>{{ role }}</div>
                <img src="../assets/vip.png" style="width: 20px" v-if="vip" />
              </div>
            </div>

            <div class="user-info-list">
              <p>粉丝数：{{ followc }}</p>
              <p>性别：{{ gender }}</p>
              <p>微信号：{{ phone }}</p>
              <p>邮箱：{{ mail }}</p>
              <p>上次登录时间：{{ date }}</p>
              <p>自我介绍：{{ address }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div class="error-handle" v-show="hide2">
            <el-button
              class="error-btn"
              type="primary"
              size="large"
              v-show="followw"
              @click="follow"
            >
              + 关注</el-button
            >
            <el-button
              class="error-btn"
              type="primary"
              size="large"
              v-show="!followw"
              @click="nofollow"
            >
              取消关注</el-button
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <el-input
              v-model="usersSearchinput"
              placeholder="搜索其他用户"
              clearable
              style="width: 200px"
            ></el-input
            >&nbsp;
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="usersSearch()"
              >搜索</el-button
            >
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>他的文章</span>
            <div
              class="handle-box"
              style="float: right; padding: 3px 0; width: 50%"
            >
              <el-input
                v-model="searchContent"
                placeholder="搜索"
                clearable
                style="width: 200px"
              ></el-input
              >&nbsp;
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                >搜索</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-delete"
                @click="remtableData"
                >重置</el-button
              >
            </div>
          </div>

          <el-table
            :data="tableData"
            border
            class="table"
            header-cell-class-name="table-header"
            height="400px"
          >
            <el-table-column label="文章标题">
              <template #default="scope">
                <router-link
                  :to="{ path: '/notedetail/' + scope.row.fq + scope.row.id }"
                >
                  {{ scope.row.title }}
                </router-link></template
              >
            </el-table-column>

            <el-table-column prop="date" label="发布时间" width="180" sortable>
              <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>

            <el-table-column
              label="收藏数"
              width="80"
              prop="collection"
              sortable
            >
              <template #default="scope">{{ scope.row.collection }}</template>
            </el-table-column>

            <el-table-column prop="zan" label="点赞数" width="80" sortable>
              <template #default="scope">{{ scope.row.zan }}</template>
            </el-table-column>

            <el-table-column prop="fan" label="访问数" width="80" sortable>
              <template #default="scope">{{ scope.row.fan }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import vHeader from "../components/Header";
import axios from "axios";
export default {
  data() {
    return {
      usersSearchinput: "",
      tableData: [],
      mtableData: [],
      user_no: unescape(this.getCookie("user_no")),
      follow_no: this.$route.query.index,
      followw: true,
      hide1: true,
      hide2: false,
      vip: false,
      id: "",
      name: "",
      img: "",
      followc: "未知",
      gender: "未知",
      phone: "未知",
      mail: "未知",
      date: "",
      state: "",
      address: "",
      form: [],
      searchContent: "",
    };
  },
  computed: {
    role() {
      return this.state === 1 ? "超级管理员" : "普通用户";
    },
  },

  components: {
    navbar,
    vHeader,
  },
  methods: {
    //用户查询
    usersSearch() {
      this.$router.push({
        path: "/user",
        query: { index: this.usersSearchinput },
      });
      location.reload();
    },
    //获取文章列表
    getData() {
      axios.get("/upload/infonotes/" + this.follow_no).then((response) => {
        let res = response.data;
        //console.log(res);
        this.tableData = res;
        this.mtableData = res;
      });
    },
    //搜索重置
    remtableData() {
      this.tableData = this.mtableData;
    },
    // 搜索按钮
    handleSearch() {
      var input = this.searchContent && this.searchContent.toLowerCase();
      var items = this.tableData;
      var items1;
      if (input) {
        this.tableData = items.filter(function (item) {
          return Object.keys(item).some(function (key1) {
            return String(item[key1]).toLowerCase().match(input);
          });
        });
      } else {
        this.tableData = items;
      }
    },
    //取消关注
    nofollow() {
      axios
        .get("/users/nofollow", {
          params: {
            user_no: this.user_no,
            follow_no: this.follow_no,
          },
        })
        .then((res) => {
          this.getUserdata();
          let r = res.data;
          if (r.flag == true) {
            this.$notify({
              title: "成功",
              message: r.msg,
              type: "success",
            });
            this.followw = true;
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
    },
    //关注功能
    follow() {
      if (unescape(this.getCookie("user_no")) == this.mail) {
        this.$message.error("您不能关注您自己哦~");
      } else {
        axios
          .get("/users/follow", {
            params: {
              user_no: this.user_no,
              follow_no: this.follow_no,
            },
          })
          .then((res) => {
            this.getUserdata();
            let r = res.data;
            if (r.flag == true) {
              this.$notify({
                title: "成功",
                message: r.msg,
                type: "success",
              });
              this.followw = false;
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
      }
    },
    //getCookie方法
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },
    //获取user_no
    checkuserno() {
      var userno = this.getCookie("user_no");
      if (userno != "") {
        if (userno == 0) {
          console.log("游客已登录");
        } else {
          this.hide1 = false;
          this.hide2 = true;
        }
      }
    },
    //上一页
    goBack() {
      this.$router.go(-1);
    },
    //获取用户信息
    getUserdata() {
      axios
        .get("/users/user/", {
          params: {
            user_no: this.user_no,
            follow_no: this.follow_no,
          },
        })
        .then((result) => {
          if (result.data.result.length == 0) {
            this.$notify.error({
              title: "错误",
              message: "查无此用户",
            });
          }
          this.getData();
          let data = result.data.result[0];
          this.date = data.date;
          this.name = data.user_name;
          this.img = data.img;
          this.followc = data.follow;
          this.phone = data.phone;
          this.gender = data.gender;
          this.mail = data.user_no;
          this.state = data.state;
          if (data.user_no == "VIP") {
            this.vip = true;
          }
          this.address = data.address;
          if (result.data.followw == true) {
            this.followw = true;
          } else {
            this.followw = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getUserdata();
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
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.container {
  width: 980px;
  padding-top: 20px;
}
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}
</style>
