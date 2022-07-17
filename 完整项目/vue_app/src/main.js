import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import 'bootstrap'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'summernote/dist/summernote-lite.css'
import 'summernote/dist/summernote-lite.js'
import store from './store/index'
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(ElementUI);
Vue.config.productionTip = false

//socket设置
import VueSocketio from 'vue-socket.io';
Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://127.0.0.1:3000', //地址+端口，由后端提供
  options: {     //Optional options, 
    autoConnect:false, //关闭自动连接，在用户登录后在连接。
  }
}));


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
