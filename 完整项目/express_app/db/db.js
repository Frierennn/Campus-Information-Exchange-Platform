const mysql = require('mysql')
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog2',
    // limit: 100
})

function query(sql, cb) {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        } else {
            connection.query(sql, (err, result) => {
                cb(err, result);
                connection.release()
            })
        }
    })
}

function query(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('数据库服务器连接出错：' + err)
            return;
        }
        connection.query(sql, params, function(err, result) {
            if (err) {
                console.log('数据库查询出错：' + err)
                return;
            }
            callback(err, result);
            connection.release();
        })
    })
};
module.exports = query;
