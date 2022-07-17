<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      var c = Math.round(Math.random() * (11 - 1) + 1);
      var l;
      switch (c - 1) {
        case 2:
          l = "wanko";
          break;
        case 3:
          l = "tsumiki";
          break;
        case 4:
          l = "unitychan";
          break;
        case 5:
          l = "haruto";
          break;
        case 9:
          l = "koharu";
          break;
        case 6:
          l = "nico";
          break;
        case 8:
          l = "tororo";
          break;
        case 0:
          l = "ni-j";
          break;
        case 10:
          l = "nipsilon";
          break;
        case 7:
          l = "nito";
          break;
        case 1:
          l = "shizuku";
          break;
      }
      console.log(l);
      window.L2Dwidget.init({
        pluginRootPath: "static/live2dw/",
        pluginJsPath: "lib/",
        pluginModelPath: "live2d-widget-model-" + l + "/assets/",
        tagMode: false,
        debug: false,
        model: {
          jsonPath:
            "live2dw/live2d-widget-model-" + l + "/assets/" + l + ".model.json",
        },
        display: { position: "right", width: 150, height: 300 },
        mobile: { show: true },
        log: false,
      });
    }, 1000);
  },
};
</script>
