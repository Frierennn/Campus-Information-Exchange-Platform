//       此代码是上一段代码块中导入的../socket/index
module.exports = (io, socket) => {

    /* 监听用户登录事件,并将数据放到socket实例的属性上 */
    socket.on('login', (data, callback) => {
        console.log('用户登录：', data);
        socket.name = data.name;
        callback(123);
    });

    
    console.log('服务端连接到长连接');
    // 接收客户端与  webdata   发送的对应消息
    socket.on('webdata', (data) => {
        console.log(data) //{ name: '张三' }
        socket.emit('webdata', { msg: 'broadcast' });
    })
    // io.emit()方法用于向服务端发送消息，参数1表示自定义的数据名，参数2表示需要配合事件传入的参数
    // io.emit('webdata', { msg: 'client connect server success' });
    // socket.broadcast.emit()表示向除了自己以外的客户端发送消息
    //socket.broadcast.emit('server message', { msg: 'broadcast' });

    // 监听断开连接状态：socket的disconnect事件表示客户端与服务端断开连接
    socket.on('disconnect', function () {
        console.log('服务端已断开长连接');
    });
    //销毁连接
    //socket.disconnect();
}
