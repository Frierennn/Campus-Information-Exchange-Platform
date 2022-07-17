const webpack = require('webpack')

module.exports = {
    publicPath: '/', 
    lintOnSave: false,
    devServer: {
        // 配置代理
        proxy: {
            '/users': {
                target: 'http://127.0.0.1:3000/',
                ws: true, //要代理 websockets，配置这个参数
                secure: false, // https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
            },
            '/upload': {
                target: 'http://127.0.0.1:3000/',
                ws: true,
                secure: false,
                changeOrigin: true,
            },
            '/comment': {
                target: 'http://127.0.0.1:3000/',
                ws: true,
                secure: false,
                changeOrigin: true,
            },
            '/newss': {
                target: 'http://127.0.0.1:3000/',
                ws: true,
                secure: false,
                changeOrigin: true,
            },
        }
    }
}
