<template>
  <div class="main">
    <el-tabs tab-position="left" @tab-click="handleClick" style="height: 700px">
      <el-tab-pane label="日常"> </el-tab-pane>
      <el-tab-pane label="二手"></el-tab-pane>
      <el-tab-pane label="求助"></el-tab-pane>
      <el-tab-pane label="交友"></el-tab-pane>
    </el-tabs>
    <div class="container" style="width: 90%">
      <div class="handle-box" style="width: 100%">
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
        ><el-button
          v-show="hide2"
          type="primary"
          icon="el-icon-edit"
          @click="baseform"
          style="float: right"
          >发布文章</el-button
        >
      </div>

      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :show-header="true"
        style="width: 100%; overflow-y: auto"
      >
        <el-table-column prop="id" label="文章id"> </el-table-column>

        <el-table-column prop="user_no" label="发布者">
          <template #default="scope">
            <router-link
              :to="{ path: '/user', query: { index: scope.row.user_no } }"
            >
              {{ scope.row.user_no }}
            </router-link></template
          >
        </el-table-column>

        <el-table-column prop="user_name" label="发布者">
          <template #default="scope">
            <router-link
              :to="{ path: '/user', query: { index: scope.row.user_no } }"
            >
              {{ scope.row.user_name }}
            </router-link></template
          >
        </el-table-column>

        <el-table-column label="文章标题" width="500">
          <template #default="scope">
            <router-link :to="{ path: '/notedetail/' + fq + scope.row.id }">
              {{ scope.row.title }}
            </router-link></template
          >
        </el-table-column>

        <el-table-column prop="date" label="发布时间"> </el-table-column>

        <el-table-column prop="collection" sortable label="收藏数" width="80">
          <template #default="scope">{{ scope.row.collection }}</template>
        </el-table-column>

        <el-table-column prop="zan" sortable label="点赞数" width="80">
          <template #default="scope">{{ scope.row.zan }}</template>
        </el-table-column>

        <el-table-column prop="fan" label="访问数" width="80" sortable>
          <template #default="scope">{{ scope.row.fan }}</template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit">
              <router-link :to="{ path: '/notechange/' + fq + scope.row.id }">
                编辑
              </router-link>
            </el-button>

            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>

    <!-- 删除弹出框 -->
    <el-dialog title="提示" :visible.sync="editVisible">
      确定要删除吗？
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import cookie from "../utils/cookie.js";
export default {
  data() {
    return {
      // 当前页
      currentPage: 1,
      // 每页多少条
      pageSize: 10,
      fq: "1",
      hide1: true,
      hide2: false,
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
  mounted() {
    this.getData();
    this.checkuserno();
  },

  methods: {
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleClick(tab) {
      this.fq = parseInt(tab.index) + 1;
      this.getData();
    },
    remtableData() {
      this.tableData = this.mtableData;
    },
    getData() {
      axios.get("/upload/testfblog/" + this.fq).then((response) => {
        let res = response.data;
        this.tableData = res;
        this.mtableData = res;
      });
    },
    baseform() {
      this.$router.push({ path: "/form" });
    },
    // 搜索按钮
    handleSearch() {
      var input = this.searchContent && this.searchContent.toLowerCase();
      var items = this.mtableData;
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

    // 删除弹出框
    handleDelete(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
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

    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 删除
    del() {
      axios
        .get("/upload/notedel/" + this.fq + this.form.id)
        .then(() => {
          this.editVisible = false;
          this.$message.success("删除成功");
          this.tableData.splice(this.idx, 1);
        })
        .catch((err) => {
          console.log(err);
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
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-flow: row;
  padding-top: 20px;
  width: 100%;
}
.router-link-active {
  text-decoration: none;
  color: #ffd04b;
}
a {
  text-decoration: none;
  color: black;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
