import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        /* 记录登录状态 */
        isLogin: false,
        /* 我的信息 */
        myInfo: {
            img: '',
            name: '',
        },
        /* 别人的信息（特指聊天对象） */
        userInfo: {
            img: '',
            name: '',
        },
        /* 用户列表 */
        userList: [
            {
                name: '王小虎',
                img: 'http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg'
            }, {
                name: '郑泷',
                img: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            }, {
                name: '小蛮',
                img: 'http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/30adcbef76094b36ba49777aa5cc7cd98c109d49.jpg'
            }, {
                name: '张云',
                img: 'http://img.52z.com/upload/news/image/20180111/20180111085521_86389.jpg'
            }
        ],
        /* 聊天记录 */
        chatMessageList: [],
    },
    mutations: {
        //vuex mutations 定义：
        setUserInfo(state, data) {
            state.userInfo = data;
        },
        setMyInfo(state, data) {
            state.myInfo = data;
        },
    },
    actions: {},
    modules: {}
})