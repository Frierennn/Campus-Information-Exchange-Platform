<template>
  <div class="about">
    <div style="width: 100%">
      <el-input
        v-model="searchContent"
        placeholder="搜索"
        class="handle-input mr10"
        clearable
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch"
        >搜索</el-button
      >
      <el-button type="primary" icon="el-icon-delete" @click="remtableData"
        >重置</el-button
      >&nbsp;
      <el-input v-model="noticetext" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-edit" @click="mass"
        >群发通知</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="user_no">
        <template #default="scope">
          <router-link
            :to="{ path: '/user', query: { index: scope.row.user_no } }"
          >
            {{ scope.row.user_no }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="user_name" width="150">
        <template #default="scope">
          <el-input v-model.trim="scope.row.user_name"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="微信号" width="150">
        <template #default="scope">
          <el-input v-model.trim="scope.row.phone"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="自我介绍" width="200" Show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model.trim="scope.row.address"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="date" label="登录时间">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>

      <el-table-column prop="follow" sortable label="粉丝数" width="80">
        <template #default="scope">
          <el-input v-model.trim="scope.row.follow"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="state" sortable>
        <template #default="scope">
          <el-input v-model.trim="scope.row.state"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope"
          ><el-button
            type="text"
            icon="el-icon-edit"
            @click="saveedit(scope.row)"
          >
            保存
          </el-button></template
        >
      </el-table-column>

      <el-table-column label="头像更改" width="200" sortable>
        <template #default="scope">
          <el-upload
            class="upload-demo"
            :data="uploadData"
            action="http://localhost:3000/users/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-success="handleSucess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button
              size="small"
              type="primary"
              @click="uploadindex(scope.row.user_no)"
              >点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </template>
      </el-table-column>

      <el-table-column label="系统通知" width="180">
        <template #default="scope">
          <el-input v-model="scope.row.notice"></el-input>
          <el-button
            size="mini"
            type="primary"
            @click="notice(scope.row.user_no, scope.row.notice)"
          >
            发送
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  data() {
    return {
      noticetext: "",
      uploadData: {
        no: "",
      },
      fileList: [],
      searchContent: "",
      tableData: [],
      mtableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      form: {},
      idx: -1,
      id: -1,
    };
  },
  methods: {
    //上传检查
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传成功
    handleSucess(response, file, fileList) {
      console.log(response, file, fileList);
      //window.parent.window.location.reload();
    },
    //群发通知
    mass() {
      var date = this.getDate();
      axios
        .post("users/mass", {
          notice: this.noticetext,
          date: date,
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.$message.success(r.msg);
          }
        });
      this.noticetext = "";
    },
    //获取时间
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
    //发送通知
    notice(user_no, notices) {
      //console.log(user_no, notices);
      var date = this.getDate();
      axios
        .post("users/notice", {
          user_no: user_no,
          notice: notices,
          date: date,
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.$message.success(r.msg);
          }
        });
    },
    //保存按钮
    saveedit(data) {
      axios.post("/users/userseditsave", data).then((res) => {
        let r = res.data;
        if (r.flag == true) {
          this.$message.success(r.msg);
          this.getData();
        }
      });
    },
    uploadindex(user_no) {
      this.uploadData.no = user_no;
      console.log(this.uploadData.no);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    remtableData() {
      this.tableData = this.mtableData;
    },
    //获取数据
    getData() {
      axios.get("/users/usersedit").then((response) => {
        let res = response.data;
        this.tableData = res;
        this.mtableData = res;
      });
    },
    vipbaseform() {
      this.$router.push({ path: "/vipform" });
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
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
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
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.about {
  padding-top: 20px;
}
.main {
  padding-top: 20px;
  width: 80%;
  /* border: solid black 1px; */
}
.router-link-active {
  text-decoration: none;
  color: #ffd04b;
}
a {
  text-decoration: none;
  color: black;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
</style>
