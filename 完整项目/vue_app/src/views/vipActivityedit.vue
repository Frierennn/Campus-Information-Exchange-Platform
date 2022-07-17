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
      ><el-button type="primary" icon="el-icon-edit" @click="vipbaseform"
        >发布活动</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="文章id"> </el-table-column>
      <el-table-column label="发布者" v-if="false">
        <template #default="scope">
          <router-link
            :to="{ path: '/user', query: { index: scope.row.user_no } }"
          >
            {{ scope.row.user_no }}
          </router-link></template
        >
      </el-table-column>

      <el-table-column prop="name" label="发布者">
        <template #default="scope">
          <router-link
            :to="{ path: '/user', query: { index: scope.row.user_no } }"
          >
            {{ scope.row.user_name }}
          </router-link></template
        >
      </el-table-column>

      <el-table-column label="文章标题" width="700px">
        <template #default="scope">
          <router-link :to="{ path: '/notedetail/' + fq + scope.row.id }">
            {{ scope.row.title }}
          </router-link></template
        >
      </el-table-column>

      <el-table-column prop="date" label="发布时间" width="180">
        <template #default="scope">{{ scope.row.date }}</template>
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

    <!-- 删除弹出框 -->
    <el-dialog title="提示" :visible.sync="editVisible" width="30%">
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
export default {
  data() {
    return {
      uploadData: {
        no: "",
      },
      fileList: [],
      fq: "5",
      hide1: true,
      hide2: false,
      query: {
        title: "",
        pageIndex: 1,
        pageSize: 10,
        state: unescape(this.getCookie("user_no")),
      },
      searchContent: "",
      tableData: [],
      mtableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
    };
  },
  methods: {
    uploadindex(index) {
      this.uploadData.no = index - 1;
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

    getData() {
      axios.get("/newss/activity").then((response) => {
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
  },
  mounted() {
    this.getData();
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
                  $("#summernote").summernote("insertImage", url);
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
