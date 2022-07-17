<template>
  <div class="main">
    <!-- 新闻轮播图 -->
    <router-link :to="{ path: '/notedetail/' + '0' + notesid }">
      <div class="carousel">
        <el-carousel
          :interval="2000"
          direction="vertical"
          height="300px"
          style="width: 60%"
          @change="changeCarousel"
        >
          <el-carousel-item
            v-for="(item, index) in tform.slice(0, 5)"
            :key="index"
          >
            <el-image
              style="width: 100%; height: 100%"
              fit="fill"
              :src="item.img"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
        <el-card shadow="hover" style="padding: 6px; width: 40%; height: 300px">
          <b style="font-size: 24px; color: #ad2a2a">{{ this.title }}</b>
          <p>{{ this.text }}</p>
          <p style="float: right; color: #387298">{{ this.date }}</p>
        </el-card>
      </div>
    </router-link>

    <!-- 新闻三个列表 -->
    <div class="news3list">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span style="color: #ad2a2a">广软快讯</span>
          <a
            href="https://news.seig.edu.cn/cms/news/2.html"
            style="float: right; padding: 3px 0"
            >更 多>></a
          >
        </div>
        <router-link
          v-for="(o, index) in xform.slice(0, 5)"
          :key="index"
          :to="{ path: '/notedetail/' + '0' + o.id }"
          class="text item"
        >
          <p style="width: 80%; float: right">{{ o.title }}</p>
          <p style="width: 20%; float: right; color: #387298">
            {{ o.date }}
          </p>
        </router-link>
      </el-card>
      <br />

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span style="color: #ad2a2a">广软视频</span>
          <a
            href="https://news.seig.edu.cn/cms/news/3.html"
            style="float: right; padding: 3px 0"
            >更 多>></a
          >
        </div>
        <router-link
          v-for="(o, index) in bform.slice(0, 5)"
          :key="index"
          :to="{ path: '/notedetail/' + '0' + o.id }"
          class="text item"
        >
          <p style="width: 80%; float: right">{{ o.title }}</p>
          <p style="width: 20%; float: right; color: #387298">
            {{ o.date }}
          </p>
        </router-link>
      </el-card>
      <br />

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span style="color: #ad2a2a">广软媒体</span>
          <a
            href="https://news.seig.edu.cn/cms/news/5.html"
            style="float: right; padding: 3px 0"
            >更 多>></a
          >
        </div>
        <router-link
          v-for="(o, index) in sform.slice(0, 5)"
          :key="index"
          :to="{ path: '/notedetail/' + '0' + o.id }"
          class="text item"
        >
          <p style="width: 80%; float: right">{{ o.title }}</p>
          <p style="width: 20%; float: right; color: #387298">
            {{ o.date }}
          </p>
        </router-link>
      </el-card>
      <br />
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
      notesid: 1,
      title: "广告title",
      text: "广告text",
      date: "广告date",
    };
  },
  methods: {
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
    // 幻灯片轮播时赋值text
    changeCarousel(active, val) {
      //active为进入幻灯片的索引值
      //val 为离开幻灯片的索引值
      this.text = this.tform[active].text;
      this.title = this.tform[active].title;
      this.date = this.tform[active].date;
      this.notesid = this.tform[active].id;
      //console.log(this.notesid);
    },
    //获取新闻
    getnewss() {
      axios
        .get("/newss/news")
        .then((res) => {
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
            }
          }
          this.text = this.tform[0].text;
          this.title = this.tform[0].title;
          this.date = this.tform[0].date;
          this.notesid = this.tform[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getnewss();
  },
};
</script>


<style>
.news3list {
  width: 100%;
  display: flex;
  flex-flow: column;
  padding-top: 20px;
  justify-content: space-between;
}
.box-card {
  width: 100%;
  display: flex;
  flex-flow: column;
}
.text.item {
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  flex-flow: row;
}
.router-link-active {
  text-decoration: none;
  color: #ad2a2a;
}
a {
  text-decoration: none;
  color: black;
}
.main {
  padding-top: 20px;
  width: 980px;
}

.carousel {
  display: flex;
  flex-flow: row;
}
</style>
