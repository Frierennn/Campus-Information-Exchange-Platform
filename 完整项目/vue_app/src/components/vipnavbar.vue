
<template>
  <div class="navbar">
    <el-menu
      ref="menu"
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      router
      style="width: 980px"
    >
      <el-menu-item index="/vipnews">广软新闻</el-menu-item>
      <el-menu-item index="/vipnewsedit">广软新闻编辑</el-menu-item>
      <el-menu-item index="/vipActivity">广软活动中心</el-menu-item>
      <el-menu-item index="/vipActivityedit">广软活动中心编辑</el-menu-item>
      <el-menu-item index="/vipFblog">广软社区分享编辑</el-menu-item>
      <el-menu-item index="/vipusers">用户管理</el-menu-item>
      <el-menu-item index="/vipfriends">我的消息</el-menu-item>
      <el-menu-item index="/vipinfo">个人中心</el-menu-item>
    </el-menu>
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view v-show="nav"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nav: true,
      activePath: "/vipnews",
    };
  },
  methods: {},
};
</script>
<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-flow: column;
}
</style>