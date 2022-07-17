<template>
  <div class="about">
    <div v-show="hide1" style="text-align: center">
      <br />
      <h1>注册体验更多内容</h1>
      <br />
      <el-button type="success" @click="register()">注册&nbsp; ></el-button>
    </div>
    <div v-show="hide2">
      <el-row :gutter="20">
        <!-- 个人信息 -->
        <el-col :span="8">
          <el-card>
            <div class="user-info">
              <el-avatar :src="img" fit="fill" class="user-avator"></el-avatar>
              <div class="user-info-cont">
                <div class="user-info-name">{{ name }}</div>
              </div>
            </div>

            <div class="user-info-list">
              <p>性别：{{ gender }}</p>
              <p>微信号：{{ phone }}</p>
              <p>邮箱：{{ mail }}</p>
              <p>上次登录时间：{{ date }}</p>
            </div>
          </el-card>
        </el-col>
        <!-- 个人信息修改 -->
        <el-col :span="16">
          <el-card>
            <i class="el-icon-lx-calendar"></i> 个人信息修改

            <el-form label-width="160px" :rules="rule">
              <el-form-item label="用户头像">
                <el-upload
                  :limit="1"
                  :data="uploadData"
                  ref="upload"
                  class="upload-demo"
                  list-type="picture-card"
                  action="http://localhost:3000/users/upload"
                  :on-success="handleSucess"
                  :before-upload="beforeAvatarUpload"
                  :auto-upload="false"
                >
                  <template #trigger>
                    <el-button size="small" type="primary">选取文件</el-button>
                  </template>

                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-form-item>

              <el-form-item label="用户名" prop="user_name">
                <el-input
                  v-model="form.user_name"
                  style="width: 160px"
                ></el-input>
              </el-form-item>

              <el-form-item label="性别">
                <el-select
                  v-model="form.gender"
                  placeholder="请选择"
                  style="width: 100px"
                >
                  <el-option key="girl" label="女" value="女"></el-option>
                  <el-option key="boy" label="男" value="男"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="微信号">
                <el-input v-model="form.phone" style="width: 200px"></el-input>
              </el-form-item>

              <el-form-item label="自我介绍">
                <el-input
                  v-model="form.address"
                  style="width: 200px；height: 320px;"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit()">确定</el-button>
                <el-button type="success" @click="reset()"
                  >重置密码&nbsp; ></el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <br />
      <!-- 我的文章 -->
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>我的文章</span>
            <div
              class="handle-box"
              style="float: right; padding: 3px 0; width: 50%"
            >
              <el-input
                v-model="searchContent.searchContent0"
                placeholder="搜索"
                clearable
                style="width: 200px"
              ></el-input
              >&nbsp;
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch(0)"
                >搜索</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-delete"
                @click="remtableData(0)"
                >重置</el-button
              >
            </div>
            <!-- 删除弹出框 -->
            <el-dialog title="提示" :visible.sync="editVisible" width="30%">
              确定要删除吗？
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editVisible = false">取 消</el-button>
                  <el-button type="primary" @click="del()">确 定</el-button>
                </span>
              </template>
            </el-dialog>
          </div>

          <el-table
            :data="tableData"
            border
            class="table"
            header-cell-class-name="table-header"
            height="500px"
          >
            <el-table-column label="文章标题" width="417px">
              <template #default="scope">
                <router-link
                  :to="{ path: '/notedetail/' + scope.row.fq + scope.row.id }"
                >
                  {{ scope.row.title }}
                </router-link></template
              >
            </el-table-column>

            <el-table-column label="发布时间" width="94" prop="date" sortable>
              <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>

            <el-table-column
              label="收藏数"
              width="88"
              prop="collection"
              sortable
            >
              <template #default="scope">{{ scope.row.collection }}</template>
            </el-table-column>

            <el-table-column label="点赞数" width="88" prop="zan" sortable>
              <template #default="scope">{{ scope.row.zan }}</template>
            </el-table-column>

            <el-table-column label="访问数" width="88" prop="fan" sortable>
              <template #default="scope">{{ scope.row.fan }}</template>
            </el-table-column>

            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                >
                  <router-link
                    :to="{ path: '/notechange/' + fq + scope.row.id }"
                  >
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
        </el-card>
      </el-row>
      <br />

      <el-row :gutter="20">
        <!-- 我的关注 -->
        <el-col :span="12"
          ><el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>我的关注</span>
              <div
                class="handle-box"
                style="float: right; padding: 3px 0; width: 70%"
              >
                <el-input
                  v-model="searchContent.searchContent1"
                  placeholder="搜索"
                  clearable
                  style="width: 100px"
                ></el-input
                >&nbsp;
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleSearch(1)"
                  >搜索</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remtableData(1)"
                  >重置</el-button
                >
              </div>
            </div>
            <el-table
              :data="followtableData"
              style="width: 100%"
              :show-header="false"
              height="200px"
            >
              <el-table-column width="width: 100%">
                <template #default="scope">
                  <router-link
                    :to="{
                      path: '/user',
                      query: { index: scope.row.user_no },
                    }"
                    style="display: flex; flex-flow: row; align-items: center"
                  >
                    <el-avatar
                      size="medium"
                      :src="
                        'http://localhost:3000/uploads/' +
                        scope.row.user_no +
                        '.jpg'
                      "
                    ></el-avatar
                    >&nbsp;&nbsp;
                    <div>{{ scope.row.user_name }}</div>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <!-- 我的收藏 -->
        <el-col :span="12"
          ><el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>我的收藏</span>
              <div
                class="handle-box"
                style="float: right; padding: 3px 0; width: 70%"
              >
                <el-input
                  v-model="searchContent.searchContent2"
                  placeholder="搜索"
                  clearable
                  style="width: 100px"
                ></el-input
                >&nbsp;
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleSearch(2)"
                  >搜索</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remtableData(2)"
                  >重置</el-button
                >
              </div>
            </div>
            <el-table
              :data="collectableData"
              style="width: 100%"
              :show-header="false"
              height="200px"
            >
              <el-table-column width="width: 100%">
                <template #default="scope">
                  <router-link
                    :to="{ path: '/notedetail/' + scope.row.notesid }"
                  >
                    {{ scope.row.title }}
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <br />

      <el-row :gutter="20">
        <!-- 我的粉丝 -->
        <el-col :span="12"
          ><el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>我的粉丝</span>
              <div
                class="handle-box"
                style="float: right; padding: 3px 0; width: 70%"
              >
                <el-input
                  v-model="searchContent.searchContent3"
                  placeholder="搜索"
                  clearable
                  style="width: 100px"
                ></el-input
                >&nbsp;
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleSearch(3)"
                  >搜索</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remtableData(3)"
                  >重置</el-button
                >
              </div>
            </div>
            <el-table
              :data="usertableData"
              style="width: 100%"
              :show-header="false"
              height="200px"
            >
              <el-table-column width="width: 100%">
                <template #default="scope"
                  ><div style="display: flex; flex-flow: row; width: 100%">
                    <router-link
                      :to="{
                        path: '/user',
                        query: { index: scope.row.user_no },
                      }"
                      style="
                        display: flex;
                        flex-flow: row;
                        align-items: center;
                        width: 80%;
                      "
                    >
                      <el-avatar
                        size="medium"
                        :src="
                          'http://localhost:3000/uploads/' +
                          scope.row.user_no +
                          '.jpg'
                        "
                      ></el-avatar
                      >&nbsp;&nbsp;
                      <div>{{ scope.row.user_name }}</div>
                    </router-link>

                    <el-popconfirm
                      confirm-button-text="好的"
                      cancel-button-text="不用了"
                      @confirm="deluser(scope.row.user_no)"
                      icon="el-icon-info"
                      icon-color="red"
                      title="确定要移除该粉丝？"
                    >
                      <el-button v-show="hide2" type="text" slot="reference"
                        >移除粉丝</el-button
                      >
                    </el-popconfirm>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import cookie from "../utils/cookie.js";
import axios from "axios";
export default {
  data() {
    return {
      collectableData: [],
      mcollectableData: [],
      followtableData: [],
      mfollowtableData: [],
      tableData: [],
      mtableData: [],
      usertableData: [],
      musertableData: [],
      editVisible: false,
      form: {},
      idx: -1,
      searchContent: {
        searchContent0: "",
        searchContent1: "",
        searchContent2: "",
        searchContent3: "",
      },
      fq: "1",
      query: {
        state: cookie.getCookie("user_no"),
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      hide1: true,
      hide2: false,
      uploadData: {
        no: "",
      },
      name: "",
      img: "",
      gender: "未知",
      phone: "未知",
      mail: "未知",
      date: cookie.getCookie("date"),
      form: {
        address: "",
        gender: "",
        phone: "",
        user_name: "",
      },
      rule: {
        user_name: [
          {
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "用户名不支持特殊字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //获取收藏列表
    getcollectData() {
      axios
        .get("/users/collectnotes/", {
          params: {
            user_no: this.mail,
          },
        })
        .then((response) => {
          let res = response.data;
          this.collectableData = res;
          this.mcollectableData = res;
        });
    },
    //获取关注列表
    getfollowData() {
      axios
        .get("/users/followlist", {
          params: {
            user_no: this.mail,
          },
        })
        .then((res) => {
          this.followtableData = res.data;
          this.mfollowtableData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取粉丝列表
    getusertableData() {
      axios
        .get("/users/userlist", {
          params: {
            follow_no: this.mail,
          },
        })
        .then((res) => {
          this.usertableData = res.data;
          this.musertableData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //移除粉丝
    deluser(no) {
      axios
        .get("/users/nouser", {
          params: {
            follow_no: this.mail,
            user_no: no,
          },
        })
        .then((res) => {
          let r = res.data;
          if (r.flag == true) {
            this.getusertableData();
            this.$notify({
              title: "成功",
              message: r.msg,
              type: "success",
            });
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
    //删除
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
    //删除弹出框
    handleDelete(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 搜索按钮
    handleSearch(id) {
      var input =
        this.searchContent[Object.keys(this.searchContent)[id]] &&
        this.searchContent[Object.keys(this.searchContent)[id]].toLowerCase();
      if (id == 0) {
        var items = this.tableData;
        if (input) {
          this.tableData = items.filter(function (item) {
            return Object.keys(item).some(function (key1) {
              return String(item[key1]).toLowerCase().match(input);
            });
          });
        } else {
          this.tableData = items;
        }
      } else if (id == 1) {
        var items = this.followtableData;
        if (input) {
          this.followtableData = items.filter(function (item) {
            return Object.keys(item).some(function (key1) {
              return String(item[key1]).toLowerCase().match(input);
            });
          });
        } else {
          this.followtableData = items;
        }
      } else if (id == 2) {
        var items = this.collectableData;
        if (input) {
          this.collectableData = items.filter(function (item) {
            return Object.keys(item).some(function (key1) {
              return String(item[key1]).toLowerCase().match(input);
            });
          });
        } else {
          this.collectableData = items;
        }
      } else {
        var items = this.usertableData;
        if (input) {
          this.usertableData = items.filter(function (item) {
            return Object.keys(item).some(function (key1) {
              return String(item[key1]).toLowerCase().match(input);
            });
          });
        } else {
          this.usertableData = items;
        }
      }
    },
    //获取文章列表
    getnotesData() {
      axios.get("/upload/infonotes/" + this.mail).then((response) => {
        let res = response.data;
        //console.log(res);
        this.tableData = res;
        this.mtableData = res;
        this.getcollectData();
        this.getfollowData();
        this.getusertableData();
      });
    },
    handleRemove(file) {
      this.$refs["upload"].clearFiles();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    register() {
      this.$router.push({ path: "/Register" });
    },
    reset() {
      this.$router.push({ path: "/Reset" });
    },
    //上传前
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
    handleSucess(res, file) {
      console.log(URL.createObjectURL(file.raw));
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
    //搜索重置
    remtableData(id) {
      if (id == 0) {
        this.tableData = this.mtableData;
      } else if (id == 1) {
        this.followtableData = this.mfollowtableData;
      } else if (id == 2) {
        this.collectableData = this.mcollectableData;
      } else {
        this.usertableData = this.musertableData;
      }
    },
    //checkuserno
    checkuserno() {
      var userno = this.getCookie("user_no");
      if (userno != "") {
        if (userno == 0) {
          console.log("游客已登录");
        } else {
          this.hide1 = false;
          this.hide2 = true;
          this.getUserdata();
          //this.$socket.connect();
        }
      }
    },

    //获取用户信息
    getUserdata() {
      axios
        .get("/users/mydata")
        .then((res) => {
          let data = res.data[0];
          this.form.gender = data.gender;
          this.form.address = data.address;
          this.form.phone = data.phone;
          this.form.user_name = data.user_name;
          this.name = data.user_name;
          this.img = data.img;
          this.phone = data.phone;
          this.gender = data.gender;
          this.mail = data.user_no;
          this.uploadData.no = data.user_no;
          this.getnotesData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //修改个人信息
    onSubmit() {
      var specialKey = /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/;
      if (specialKey.test(this.form.user_name)) {
        this.$refs.upload.submit();
        axios
          .post("/users/update", {
            user_name: this.form.user_name,
            phone: this.form.phone,
            gender: this.form.gender,
            address: this.form.address,
          })
          .then((res) => {
            let r = res.data;
            if (r.affectedRows == 1) {
              this.$message.success("修改成功！");
              window.parent.window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$notify.error({
          title: "错误",
          message: "用户名不支持特殊字符",
        });
      }
    },
  },
  mounted() {
    this.checkuserno();
  },
};
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.about {
  padding-top: 20px;
  width: 980px;
}
.user-info {
  display: flex;
  align-items: center;
  flex-flow: column;
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
.router-link-active {
  text-decoration: none;
  color: #ffd04b;
}
a {
  text-decoration: none;
  color: black;
}
</style>