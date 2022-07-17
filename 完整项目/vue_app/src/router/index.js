import Vue from 'vue'
import VueRouter from 'vue-router'
import cookie from '../utils/cookie.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import("../views/Welcome.vue")
  },

  {
    path: '/viplogin',
    name: 'vipLogin',
    component: () => import("../views/vipLogin.vue")
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../views/Login.vue")
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("../views/Register.vue")
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import("../views/Reset.vue")
  }, {
    path: '/notedetail/:id',
    name: 'notedetail',
    meta: {
      title: '详情'
    },
    component: () =>
      import(
        '../views/Notedetail.vue')
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      title: '用户'
    },
    component: () =>
      import(
        '../views/User.vue')
  },
  {
    path: '/notechange/:id',
    name: 'notechange',
    meta: {
      title: '文章修改'
    },
    component: () =>
      import(
        '../views/Notechange.vue')
  },
  {
    path: "/form",
    name: "baseform",
    meta: {
      title: '表单'
    },
    component: () =>
      import(
        "../views/BaseForm.vue")
  },
  {
    path: "/vipform",
    name: "vipbaseform",
    meta: {
      title: '表单'
    },
    component: () =>
      import(
        "../views/vipBaseForm.vue")
  },  {
    path: "/vipnewsBaseForm",
    name: "vipnewsBaseForm",
    meta: {
      title: '表单'
    },
    component: () =>
      import(
        "../views/vipnewsBaseForm.vue")
  },
  {
    path: '/wtbhome',
    name: 'Wtbhome',
    component: () => import("../views/Wtbhome.vue"),
    redirect: '/news',
    children: [
      {
        path: '/news',
        name: 'news',
        component: () => import('../views/News.vue'),
        meta: {
          title: '新闻'
        }
      }, {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/Activity.vue'),
        meta: {
          title: '活动'
        }
      },
      {
        path: '/fblog',
        component: () => import('../views/Fblog.vue'),
        meta: {
          title: '文章'
        }
      },
      {
        path: '/friends',
        component: () => import('../views/Friends.vue'),
        meta: {
          title: '好友'
        }
      },
      {
        path: '/info',
        component: () => import('../views/Info.vue'),
        meta: {
          title: '个人信息'
        }
      }
    ]
  },
  {
    path: '/viphome',
    name: 'viphome',
    component: () => import("../views/viphome.vue"),
    redirect: '/vipnews',
    children: [
      {
        path: '/vipnews',
        name: 'vipnews',
        component: () => import('../views/vipnews.vue'),
        meta: {
          title: '新闻'
        }
      },
      {
        path: '/vipnewsedit',
        name: 'vipnewsedit',
        component: () => import('../views/vipnewsedit.vue'),
        meta: {
          title: '新闻编辑'
        }
      },
      {
        path: '/vipactivity',
        name: 'vipactivity',
        component: () => import('../views/vipActivity.vue'),
        meta: {
          title: '活动'
        }
      },
      {
        path: '/vipactivityedit',
        name: 'vipactivityedit',
        component: () => import('../views/vipActivityedit.vue'),
        meta: {
          title: '活动编辑'
        }
      },
      {
        path: '/vipfblog',
        component: () => import('../views/vipFblog.vue'),
        meta: {
          title: '文章编辑'
        }
      },
      {
        path: '/vipfriends',
        component: () => import('../views/vipFriends.vue'),
        meta: {
          title: '好友'
        }
      }, 
      {
        path: '/vipusers',
        component: () => import('../views/vipusers.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/vipinfo',
        component: () => import('../views/vipInfo.vue'),
        meta: {
          title: '个人信息'
        }
      }
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next('/')
  } else if (cookie.getCookie('user_no')) {
    next()
  } else {
    if (to.path == '/welcome') {
      next()
    } else {
      next('/welcome')
    }
  }
})

export default router
