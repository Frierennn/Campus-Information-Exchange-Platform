<template>
  <div class="main">
    <br />
    <el-divider content-position="left"
      ><p style="font-size: 20px; color: #ad2a2a">摊位活动</p></el-divider
    ><br />
    <div class="d1">
      <el-popover
        v-for="(item, index) in tform"
        v-bind:key="index"
        placement="bottom"
        :title="item.title"
        width="20px"
        trigger="hover"
        :content="item.text"
        style="margin-right: 50px; margin-bottom: 20px"
      >
        <el-button
          @click="btu(item.id)"
          slot="reference"
          style="
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            margin-right: 50px;
          "
          >{{ item.title }}<el-badge value="hot" class="item"> </el-badge
        ></el-button>
      </el-popover>
    </div>

    <br />
    <el-divider content-position="left"
      ><p style="font-size: 20px; color: #ad2a2a">招聘宣讲</p></el-divider
    ><br />
    <div class="d1">
      <el-popover
        v-for="(item, index) in xform"
        v-bind:key="index"
        placement="bottom"
        :title="item.title"
        width="20px"
        trigger="hover"
        :content="item.text"
        style="margin-right: 50px"
      >
        <el-button
          @click="btu(item.id)"
          slot="reference"
          style="
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            margin-right: 50px;
          "
          >{{ item.title }}<el-badge value="hot" class="item"> </el-badge
        ></el-button>
      </el-popover>
    </div>

    <br />
    <el-divider content-position="left"
      ><p style="font-size: 20px; color: #ad2a2a">比赛报名</p></el-divider
    ><br />
    <div class="d1">
      <el-popover
        v-for="(item, index) in bform"
        v-bind:key="index"
        placement="bottom"
        :title="item.title"
        width="20px"
        trigger="hover"
        :content="item.text"
        style="margin-right: 50px"
      >
        <el-button
          @click="btu(item.id)"
          slot="reference"
          style="
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            margin-right: 50px;
          "
          >{{ item.title }}<el-badge value="hot" class="item"> </el-badge
        ></el-button>
      </el-popover>
    </div>

    <br />
    <el-divider content-position="left"
      ><p style="font-size: 20px; color: #ad2a2a">社团招新</p></el-divider
    ><br />
    <div class="d1">
      <el-popover
        v-for="(item, index) in sform"
        v-bind:key="index"
        placement="bottom"
        :title="item.title"
        width="20px"
        trigger="hover"
        :content="item.text"
        style="margin-right: 50px"
      >
        <el-button
          @click="btu(item.id)"
          slot="reference"
          style="
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            margin-right: 50px;
          "
          >{{ item.title }}<el-badge value="hot" class="item"> </el-badge
        ></el-button>
      </el-popover>
    </div>

    <br />
    <el-divider content-position="left"
      ><p style="font-size: 20px; color: #ad2a2a">商家优惠</p></el-divider
    ><br />
    <div class="d1">
      <el-popover
        v-for="(item, index) in yform"
        v-bind:key="index"
        placement="bottom"
        :title="item.title"
        width="20px"
        trigger="hover"
        :content="item.text"
        style="margin-right: 50px"
      >
        <el-button
          @click="btu(item.id)"
          slot="reference"
          style="
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            margin-right: 50px;
          "
          >{{ item.title }}<el-badge value="hot" class="item"> </el-badge
        ></el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      tform: [],
      xform: [],
      bform: [],
      sform: [],
      yform: [],
    };
  },
  methods: {
    btu(id) {
      this.$router.push("/notedetail/" + 5 + id);
    },
    //分类
    sort_pro(data, keys = []) {
      //keys可以传一个数组
      var c = [];
      var d = {};
      for (var element of data) {
        let element_keyStr = "";
        let element_key = [];
        let element_keyObj = {};
        for (var key of keys) {
          element_key.push(element[key]);
          element_keyObj[key] = element[key];
        }
        element_keyStr = element_key.join("_");
        if (!d[element_keyStr]) {
          c.push({
            ...element_keyObj,
            children: [element],
          });
          d[element_keyStr] = element;
        } else {
          for (var ele of c) {
            let isTrue = keys.some((key) => {
              return ele[key] != element[key];
            });
            if (!isTrue) {
              ele.children.push(element);
            }
          }
        }
      }
      return c;
    },
    //获取活动
    getData() {
      axios.get("/newss/activity").then((res) => {
        this.tableData = this.sort_pro(res.data, ["fl"]).reverse();
        //console.log(this.tableData);
        for (let [index, item] of this.tableData.entries()) {
          // console.log(index, item.fl);
          switch (item.fl) {
            case 0:
              this.tform = this.tableData[index].children;
              break;
            case 1:
              this.xform = this.tableData[index].children;
              break;
            case 2:
              this.bform = this.tableData[index].children;
              break;
            case 3:
              this.sform = this.tableData[index].children;
              break;
            case 4:
              this.yform = this.tableData[index].children;
              break;
          }
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
.d1 {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
.main {
  width: 100%;
}
el-divider {
  width: 100%;
}
</style>
