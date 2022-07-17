<template>
  <el-container style="width: 100%; height: 580px;padding-right:30px;padding-left:30px;padding-top:20px">
    <div v-show="hide1" style="text-align: center; width: 100%">
      <br />
      <h1>注册体验更多内容</h1>
      <br />
      <el-button type="success" @click="register()">注册&nbsp; ></el-button>
    </div>

    <el-aside v-show="hide2" width="200px" height=" 580px">
      <div>
        <el-row style="height: 60px; padding-top: 10px"
          ><div class="myinfo">
            <el-avatar :src="myInfo.img"></el-avatar>
            <span>{{ myInfo.name }}</span>
          </div>
        </el-row>
        <el-row style="height: 50px">
          <el-input v-model="keyword" placeholder="搜索好友">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-row>
        <el-row style="height: 390px"
          ><el-table
            :data="
              tableData.filter(
                (data) =>
                  !keyword ||
                  data.name.toLowerCase().includes(keyword.toLowerCase())
              )
            "
            stripe
            style="cursor: pointer; width: 100%"
            :show-header="false"
            @row-click="setUserInfo"
          >
            <el-table-column label="日期">
              <template slot-scope="scope">
                <el-avatar :src="scope.row.img"></el-avatar>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
          </el-table></el-row
        >
      </div>
    </el-aside>
    
    <el-container v-show="hide2">
      <el-header>
        <span v-if="userInfo.name == '默认群聊'"
          >{{ userInfo.name }}:{{ userList.length - 1 }}</span
        >
        <span v-else>{{ userInfo.name }}</span>
      </el-header>
      <el-main>
        <div class="div1">
          <!-- 先循环找到你想要聊天的那个人 -->
          <div v-for="(list, index) in msgList" :key="index">
            <!-- 有聊天记录：循环聊天记录 -->
            <div v-if="list.username == userInfo.name">
              <!-- 再循环显示聊天记录 -->
              <p
                :class="{ right: msg.type == 'my' }"
                v-for="(msg, index) in list.list"
                :key="index"
              >
                <el-avatar
                  v-if="msg.type == 'user'"
                  :src="userInfo.img"
                ></el-avatar>
                <el-avatar
                  v-if="msg.type == 'my'"
                  :src="myInfo.img"
                  style="float: right"
                ></el-avatar>
                <span class="content">{{ msg.msg }}</span>
              </p>
            </div>
          </div>
        </div>
      </el-main>
      <el-footer>
        <el-input
          placeholder="请输入内容"
          v-model="input"
          @keyup.enter.native="send"
        >
        </el-input>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import store from "../store/index";

export default {
  data() {
    return {
      hide1: true,
      hide2: false,
      input: "",
      keyword: "",
      msgList: [
        {
          username: "王小虎",
          list: [
            {
              type: "my",
              time: "",
              msg: "你好啊",
            },
            {
              type: "user",
              time: "",
              msg: "你好啊",
            },
            {
              type: "user",
              time: "",
              msg: "你好啊",
            },
          ],
        },
      ],
    };
  },

  //App引用：
  computed: {
    tableData(){
      return store.state.userList;
    },
    
    myInfo() {
      return store.state.myInfo;
    },

    userInfo() {
      return store.state.userInfo;
    },
  },

  methods: {
    register() {
      this.$router.push({ path: "/Register" });
    },
    //组件触发：
    setUserInfo(row, column, event) {
      store.commit("setUserInfo", { name: row.name, img: row.img });
    },

    send() {
      /* 发送消息 */
      console.log(this.input);
      /* 清空输入框 */
      this.input = "";
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
          store.commit("setMyInfo", {
            img: unescape(this.getCookie("img")),
            name: decodeURI(this.getCookie("user_name")),
          });
        }
      }
    },
  },

  mounted() {
    this.checkuserno();
  },
};
</script>

<style>
.div1 {
  width: 100%;
}
.div1 P {
  width: 100%;
  height: 50px;
}
.content {
  background-color: antiquewhite;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
}
.right {
  text-align: right;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 580px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 280px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>